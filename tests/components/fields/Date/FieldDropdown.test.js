import renderGravityForm from "../../render";
import mockFormData from "../../../mocks/formData";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";

import { submitGravityForm } from "../../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Date: FieldDropdown", () => {
  const field = {
    id: 6,
    type: "DATE",
    dateFormat: "MDY",
    dateType: "FIELD",
    defaultValue: null,
    inputs: [
      {
        id: 6.1,
        label: "Month",
      },
      {
        id: 6.2,
        label: "Day",
      },
      {
        id: 6.3,
        label: "Year",
      },
    ],
    isRequired: true,
    label: "Date",
  };

  describe("Number dropdown", () => {
    const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;
    let renderer;

    beforeEach(() => {
      renderer = renderGravityForm({
        data: {
          gfForm: {
            formFields: { nodes: [{ ...field, dateType: "DROPDOWN" }] },
          },
        },
        helperFieldsSettings: {
          date: {
            dateMaxYear: 2020,
          },
        },
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("renders correctly", async () => {
      const { container } = renderer;

      const element = container.querySelector(`#${fieldId}`);

      const dayInput = container.querySelector("select[name='day[]']");
      const monthInput = container.querySelector("select[name='month[]']");
      const yearInput = container.querySelector("select[name='year[]']");

      expect(element).toBeInTheDocument();

      // check existence
      expect(dayInput).toBeInTheDocument();
      expect(monthInput).toBeInTheDocument();
      expect(yearInput).toBeInTheDocument();

      expect(dayInput.querySelectorAll("option").length).toBe(32);
      expect(monthInput.querySelectorAll("option").length).toBe(13);
      expect(yearInput.querySelectorAll("option").length).toBe(102);

      // check if date field renders month as first field in a list, it should respect dateFormat value
      expect(
        container
          .querySelector(".ginput_container_date")
          .firstChild.className.includes("gfield_date_dropdown_month")
      ).toBe(true);
    });

    it("renders required error", async () => {
      const { getByText } = renderer;

      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(getByText(/Field is required./i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("renders invalid value error", async () => {
      const { container, getByText } = renderer;

      const monthInput = container.querySelector("select[name='month[]']");

      fireEvent.change(monthInput, { target: { value: 14 } });

      await act(() => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(getByText(/Please enter a valid date/i)).toBeInTheDocument();

      expect(submitGravityForm).not.toBeCalled();
    });
  });

  // inputs with field type number
  describe("Number input", () => {
    const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;
    let renderer;

    beforeEach(() => {
      renderer = renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [field] } },
        },
        helperFieldsSettings: {
          date: {
            dateMaxYear: 2020,
          },
        },
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("renders correctly", async () => {
      const { container, getByLabelText } = renderer;

      const element = container.querySelector(`#${fieldId}`);

      const dayInput = getByLabelText("Day");
      const monthInput = getByLabelText("Month");
      const yearInput = getByLabelText("Year");

      expect(element).toBeInTheDocument();

      // check existence
      expect(dayInput).toBeInTheDocument();
      expect(monthInput).toBeInTheDocument();
      expect(yearInput).toBeInTheDocument();

      // check attributes
      expect(dayInput.getAttribute("min")).toBe("1");
      expect(dayInput.getAttribute("max")).toBe("31");
      expect(dayInput.getAttribute("name")).toBe("day[]");

      expect(monthInput.getAttribute("max")).toBe("12");
      expect(monthInput.getAttribute("name")).toBe("month[]");

      // we check if attr is set, but also dateMaxYear option
      expect(yearInput.getAttribute("max")).toBe("2020");
      expect(yearInput.getAttribute("name")).toBe("year[]");
    });

    it("renders required error", async () => {
      const { getByText } = renderer;

      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(getByText(/Field is required./i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("renders invalid value error", async () => {
      const { getByLabelText, getByText } = renderer;

      const monthInput = getByLabelText("Month");

      fireEvent.input(monthInput, { target: { value: -1 } });

      await act(() => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(getByText(/Please enter a valid date/i)).toBeInTheDocument();

      expect(submitGravityForm).not.toBeCalled();
    });

    it("pass correct value for the form submission", async () => {
      const { getByLabelText } = renderer;

      const dayInput = getByLabelText("Day");
      const monthInput = getByLabelText("Month");
      const yearInput = getByLabelText("Year");

      fireEvent.input(monthInput, { target: { value: 12 } });
      fireEvent.input(dayInput, { target: { value: 20 } });
      fireEvent.input(yearInput, { target: { value: 2018 } });

      await act(() => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            value: "12/20/2018",
            id: field.id,
          },
        ],
      });
    });
  });

  describe("formats value", () => {
    const formats = [
      { format: "DMY_DASH", value: "20-12-2018" },
      { format: "DMY_DOT", value: "20.12.2018" },
      { format: "MDY", value: "12/20/2018" },
      { format: "YMD_DASH", value: "2018-12-20" },
      { format: "YMD_DOT", value: "2018.12.20" },
      { format: "YMD_SLASH", value: "2018/12/20" },
    ];

    formats.forEach(({ format, value }) => {
      it(`formats value based on a date format - ${format}`, async () => {
        const { getByLabelText } = renderGravityForm({
          data: {
            gfForm: {
              formFields: { nodes: [{ ...field, dateFormat: format }] },
            },
          },
          helperFieldsSettings: {
            date: {
              dateMaxYear: 2020,
            },
          },
        });

        const dayInput = getByLabelText("Day");
        const monthInput = getByLabelText("Month");
        const yearInput = getByLabelText("Year");

        fireEvent.input(monthInput, { target: { value: 12 } });
        fireEvent.input(dayInput, { target: { value: 20 } });
        fireEvent.input(yearInput, { target: { value: 2018 } });

        await act(() => {
          fireEvent.submit(screen.getByRole("button"));
        });

        expect(submitGravityForm).toBeCalledWith({
          id: mockFormData.gfForm.databaseId,
          fieldValues: [
            {
              value,
              id: field.id,
            },
          ],
        });
      });
    });
  });
});
