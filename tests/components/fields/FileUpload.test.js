import renderGravityForm from "../render";
import { screen } from "@testing-library/dom";
import mockFormData from "../../mocks/formData";
import {
  getByText,
  queryByText,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-url");

const field = {
  id: 11,
  cssClass: null,
  description: null,
  descriptionPlacement: "INHERIT",
  errorMessage: null,
  isRequired: true,
  label: "File",
  value: null,
  allowedExtensions: ["pdf", "exe"], //allow exe to test whether server rejects it
  canAcceptMultipleFiles: false,
  inputType: null,
  maxFileSize: 1, // MB
  maxFiles: null,
  type: "FILEUPLOAD",
};

const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

describe("File upload field", () => {
  let container;
  let element;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: "mockData" }),
      })
    );

    const rendered = renderGravityForm({
      gfForm: { formFields: { nodes: [field] } },
    });
    container = rendered.container;

    element = container.querySelector(`#${fieldId}`);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders correctly", async () => {
    // upload field rendered
    expect(element).toBeInTheDocument();

    // displays rules
    expect(
      container.querySelector(`.gform_fileupload_rules`)
    ).toHaveTextContent("Accepted file types: pdf, exe. Max. file size: 1MB");
  });

  describe("handle errors", () => {
    it("should display error when file type is not correct", async () => {
      const fileInput = screen.getByLabelText(/File/i);

      // mock file
      const file = new File(["hello"], "hello.png", { type: "image/png" });

      // add value
      fireEvent.change(fileInput, { target: { files: [file] } });

      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(
          getByText(
            element,
            /The uploaded file type is not allowed. Must be one of the following/i
          )
        ).toBeInTheDocument();
      });
    });

    it("rejects a file larger than 1MB", async () => {
      const fileInput = screen.getByLabelText(/File/i);

      // mock file
      const file = new File(
        [new ArrayBuffer(1024 * 1024 * 2)],
        "largeFile.png",
        {
          type: "image/png",
        }
      );

      // add value
      fireEvent.change(fileInput, { target: { files: [file] } });

      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(
          getByText(element, /File exceeds size limit. Maximum file size/i)
        ).toBeInTheDocument();
      });
    });

    it("displays error when file is required and no value added", async () => {
      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(
          getByText(element, /This field is required/i)
        ).toBeInTheDocument();
      });
    });

    it("displays error when user tries to upload risky file", async () => {
      // Mock the submitGravityForm function to reject with the specific error
      submitGravityForm.mockRejectedValueOnce({
        data: {
          submitGfForm: {
            errors: [
              {
                id: 1,
                message: "The uploaded file type is not allowed.",
              },
            ],
          },
        },
      });

      const fileInput = screen.getByLabelText(/File/i);

      // mock risky file
      const file = new File(["hello"], "hello.exe", {
        type: "application/x-msdownload",
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));
      });

      expect(submitGravityForm).toBeCalled();
    });
  });

  describe("upload works", () => {
    // Mock fetch globally
    global.fetch = jest.fn();

    beforeEach(() => {
      fetch.mockClear();
    });

    it("able to upload", async () => {
      submitGravityForm.mockResolvedValueOnce({
        data: {
          submitGfForm: {
            errors: [],
          },
        },
      });

      const fileInput = screen.getByLabelText(/File/i);

      // mock file
      const file = new File([new ArrayBuffer(1024)], "upload.pdf", {
        type: "application/pdf",
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));
      });

      expect(submitGravityForm).toBeCalled();
      // we check if there is file value being processed, we don't check actual uploading
      expect(
        submitGravityForm.mock.calls[0][0].fieldValues[0].fileUploadValues
      ).toEqual([file]);
    });
  });
});

describe("Multi file upload", () => {
  let container;
  let element;

  const multiupload = {
    ...field,
    canAcceptMultipleFiles: true,
    maxFiles: 2,
    inputType: "FILEUPLOAD",
  };

  beforeEach(async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: "mockData" }),
      })
    );

    const rendered = await act(async () => {
      return renderGravityForm({
        gfForm: { formFields: { nodes: [multiupload] } },
      });
    });

    container = rendered.container;

    element = container.querySelector(`#${fieldId}`);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders correctly", async () => {
    const fileInput = container.querySelector('input[type="file"]');

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["file contents"], "file.pdf", {
              type: "application/pdf",
            }),
          ],
        },
      });
    });

    // multifile upload renders
    expect(element).toBeInTheDocument();
    expect(getByText(element, /Drop files here/i)).toBeInTheDocument();

    // displays rules
    expect(element.querySelector(`.gform_fileupload_rules`)).toHaveTextContent(
      "Max. files: 2"
    );

    // renders preview
    expect(element.querySelector(`.ginput_preview_list`)).toHaveTextContent(
      "file.pdf"
    );
  });

  it("removes file when user clicks on delete button", async () => {
    const fileInput = container.querySelector('input[type="file"]');

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["file contents"], "file.pdf", {
              type: "application/pdf",
            }),
            new File(["file contents"], "file2.pdf", {
              type: "application/pdf",
            }),
          ],
        },
      });
    });

    const deleteBtn = container.querySelector(".gform_delete_file");

    // Click the delete button
    await act(async () => {
      fireEvent.click(deleteBtn);
    });

    await waitFor(() => {
      expect(queryByText(element, /file.pdf/i)).not.toBeInTheDocument();
    });
  });

  it("displays error when field is required", async () => {
    fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));

    await waitFor(() => {
      expect(getByText(element, /This field is required/i)).toBeInTheDocument();
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("displays error when user tries to upload unsupported file", async () => {
    const fileInput = container.querySelector('input[type="file"]');

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["file contents"], "image.jpeg", {
              type: "image/jpeg",
            }),
          ],
        },
      });
    });

    await waitFor(() => {
      expect(
        getByText(element, /image.jpeg - This type of file is not allowed/i)
      ).toBeInTheDocument();
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("displays error when user tries to upload larger file that is allowed", async () => {
    const fileInput = container.querySelector('input[type="file"]');

    const bytesPerMB = 1024 * 1024;
    const size = 2 * bytesPerMB;
    const fileData = new Uint8Array(size);
    const blob = new Blob([fileData], { type: "application/pdf" });
    const file = new File([blob], `largePDFFile-${2}MB.pdf`, {
      type: "application/pdf",
    });

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });
    });

    await waitFor(() => {
      expect(
        getByText(element, /File exceeds size limit/i)
      ).toBeInTheDocument();
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("displays error when user tries to upload more files than allowed", async () => {
    const fileInput = container.querySelector('input[type="file"]');

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["file contents"], "image.pdf", {
              type: "application/pdf",
            }),
            new File(["file contents"], "image2.pdf", {
              type: "application/pdf",
            }),
            new File(["file contents"], "image3.pdf", {
              type: "application/pdf",
            }),
          ],
        },
      });
    });

    await waitFor(() => {
      expect(
        getByText(element, /Maximum number of files reached/i)
      ).toBeInTheDocument();
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  describe("upload works", () => {
    // Mock fetch globally
    global.fetch = jest.fn();

    beforeEach(() => {
      fetch.mockClear();
    });

    it("uploads works", async () => {
      submitGravityForm.mockResolvedValueOnce({
        data: {
          submitGfForm: {
            errors: [],
          },
        },
      });

      const fileInput = container.querySelector('input[type="file"]');

      await act(async () => {
        fireEvent.change(fileInput, {
          target: {
            files: [
              new File(["file contents"], "image.pdf", {
                type: "application/pdf",
              }),
              new File(["file contents"], "image2.pdf", {
                type: "application/pdf",
              }),
            ],
          },
        });
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));
      });

      expect(submitGravityForm).toBeCalled();
      // we check if there is file value being processed, we don't check actual uploading
      expect(
        submitGravityForm.mock.calls[0][0].fieldValues[0].fileUploadValues
          .length
      ).toEqual(2);
    });
  });
});
