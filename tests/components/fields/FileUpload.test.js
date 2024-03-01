import renderGravityForm from "../render";
import { screen } from "@testing-library/dom";
import mockFormData from "../../mocks/formData";
import { getByText, fireEvent, waitFor, act } from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("File upload field", () => {
  let container;
  let element;

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

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

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
      expect(
        submitGravityForm.mock.calls[0][0].fieldValues[0].fileUploadValues
      ).toEqual([file]);
    });
  });
});
