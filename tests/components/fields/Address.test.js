import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import {
  getByText,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Address field", () => {
  const baseField = {
    id: 8,
    databaseId: 8,
    addressType: "INTERNATIONAL",
    type: "ADDRESS",
    label: "Address",
    isRequired: false,
    inputs: [
      {
        label: "Street Address",
        id: 8.1,
        key: "street",
      },
      {
        label: "Address Line 2",
        id: 8.2,
        key: "lineTwo",
      },
      {
        label: "City",
        id: 8.3,
        key: "city",
        defaultValue: "Berlin",
      },
      {
        label: "State / Province",
        id: 8.4,
        key: "state",
      },
      {
        label: "ZIP / Postal Code",
        id: 8.5,
        key: "zip",
      },
      {
        label: "Country",
        id: 8.6,
        key: "country",
      },
    ],
  };

  let container;
  let unmount;

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${baseField.id}`;

  /** -----------------------
   * Helpers
   * --------------------- */

  /**
   * Renders a Gravity Forms Address field for tests.
   *
   * This helper allows overriding:
   * - field-level properties (e.g. addressType, defaultCountry, isRequired)
   * - specific address inputs (e.g. country, state, city) without mutating base data
   *
   * @param {Object} overrides
   *   Field-level overrides applied to the base address field.
   *   Example:
   *     { addressType: "CANADA", defaultCountry: "CA" }
   *
   * @param {Object} inputOverrides
   *   Overrides for individual address inputs, keyed by input `key`.
   *   Each override is shallow-merged into the matching input.
   *   Example:
   *     {
   *       country: { defaultValue: "Canada" },
   *       city: { defaultValue: "Toronto" }
   *     }
   *
   * @example
   *   renderAddressField(
   *     { addressType: "US", defaultCountry: "US" },
   *     { country: { defaultValue: "United States" } }
   *   );
   *
   * @returns {void}
   *   Sets `container` and `unmount` for use in tests.
   */
  const renderAddressField = (overrides = {}, inputOverrides = {}) => {
    const field = withInputOverrides(
      { ...baseField, ...overrides },
      inputOverrides
    );

    const rendered = renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: [
              {
                ...field,
              },
            ],
          },
        },
      },
    });

    container = rendered.container;
    unmount = rendered.unmount;
  };

  const withInputOverrides = (field, overridesByKey = {}) => {
    return {
      ...field,
      inputs: field.inputs.map((input) => {
        const override = overridesByKey[input.key];
        return override ? { ...input, ...override } : input;
      }),
    };
  };

  const expectDropdownWithOptions = (label, options) => {
    const select = screen.getByLabelText(label);
    expect(select.tagName).toBe("SELECT");

    options.forEach((option) => {
      expect(select).toContainHTML(option);
    });
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  /** -----------------------
   * General behavior
   * --------------------- */

  describe("general behavior", () => {
    beforeEach(() => {
      renderAddressField();
    });

    it("renders the address form", () => {
      const element = container.querySelector(`#${fieldId}`);
      expect(element).toBeInTheDocument();
    });

    it("applies default values to inputs", () => {
      const city = screen.getByLabelText("City");
      expect(city.value).toBe("Berlin");
    });

    it("renders all address inputs", () => {
      expect(container.querySelector(".ginput_container").children.length).toBe(
        6
      );
    });

    it("doesn't throw error if not required", async () => {
      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(submitGravityForm).toBeCalled();
    });

    it("throws error if required", async () => {
      unmount();
      renderAddressField({ isRequired: true });

      const element = container.querySelector(`#${fieldId}`);
      fireEvent.change(screen.getByLabelText("State / Province / Region"), {
        target: {
          value: "Lviv region",
        },
      });
      fireEvent.change(screen.getByLabelText("ZIP / Postal Code"), {
        target: {
          value: "79000",
        },
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });

      await waitFor(() => {
        expect(
          getByText(
            element,
            /This field is required. Please complete the following fields: Street Address, Address Line 2, Country/
          )
        ).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("submits form when values are entered correctly", async () => {
      fireEvent.change(screen.getByLabelText("Street Address"), {
        target: {
          value: "2662 Oakdale Avenue",
        },
      });

      fireEvent.input(screen.getByLabelText("Address Line 2"), {
        target: {
          value: "2662 Oakdale Avenue 2",
        },
      });

      fireEvent.input(screen.getByLabelText("State / Province / Region"), {
        target: {
          value: "Florida",
        },
      });

      fireEvent.input(screen.getByLabelText("ZIP / Postal Code"), {
        target: {
          value: "33801",
        },
      });

      fireEvent.change(screen.getByLabelText("Country"), {
        target: { value: "United States" },
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(
        container.querySelector(`.gravityform__error_message`)
      ).not.toBeInTheDocument();

      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            addressValues: {
              street: "2662 Oakdale Avenue",
              lineTwo: "2662 Oakdale Avenue 2",
              city: "Berlin",
              state: "Florida",
              zip: "33801",
              country: "US",
            },
            id: baseField.id,
          },
        ],
      });

      expect(
        container.querySelector(`.gravityform__error_message`)
      ).not.toBeInTheDocument();

      expect(submitGravityForm).toBeCalled();
    });
  });

  /** -----------------------
   * INTERNATIONAL
   * --------------------- */

  describe("when addressType is INTERNATIONAL", () => {
    beforeEach(() => {
      renderAddressField({ addressType: "INTERNATIONAL" });
    });

    it("renders international-specific labels", () => {
      expect(
        screen.getByLabelText("State / Province / Region")
      ).toBeInTheDocument();

      expect(screen.getByLabelText("ZIP / Postal Code")).toBeInTheDocument();
    });

    it("renders country as a dropdown", () => {
      expectDropdownWithOptions("Country", ["Austria", "Bulgaria", "Libya"]);
    });
  });

  /** -----------------------
   * US
   * --------------------- */

  describe("when addressType is US", () => {
    beforeEach(() => {
      renderAddressField({ addressType: "US", defaultCountry: "US" });
    });

    it("renders US-specific labels", () => {
      expect(screen.getByLabelText("State")).toBeInTheDocument();
      expect(screen.getByLabelText("ZIP Code")).toBeInTheDocument();
    });

    it("renders hidden country input with correct value", () => {
      const hiddenInput = container.querySelector(
        'input[type="hidden"][name="input_8.6"]'
      );

      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput.value).toBe("United States");
    });

    it("renders state as a dropdown", () => {
      expectDropdownWithOptions("State", ["California", "New York", "Texas"]);
    });
  });

  /** -----------------------
   * CANADA
   * --------------------- */

  describe("when addressType is CANADA", () => {
    beforeEach(() => {
      renderAddressField({ addressType: "CANADA", defaultCountry: "CA" });
    });

    it("renders Canada-specific labels", () => {
      expect(screen.getByLabelText("Province")).toBeInTheDocument();
      expect(screen.getByLabelText("Postal Code")).toBeInTheDocument();
    });

    it("renders hidden country input with correct value", () => {
      const hiddenInput = container.querySelector(
        'input[type="hidden"][name="input_8.6"]'
      );

      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput.value).toBe("Canada");
    });

    it("renders province as a dropdown", () => {
      expectDropdownWithOptions("Province", ["Alberta", "Ontario", "Quebec"]);
    });
  });

  /** -----------------------
   * OTHER CASES
   * --------------------- */

  describe.each([
    {
      title:
        "when defaultCountry is set, but input defaultValue is not for addressType CANADA",
      overrides: { defaultCountry: "CA", addressType: "CANADA" },
      inputOverrides: {},
      expectedValue: "Canada",
    },
    {
      title:
        "when both defaultCountry and input defaultValue are set for addressType CANADA",
      overrides: { defaultCountry: "CA", addressType: "CANADA" },
      inputOverrides: { country: { defaultValue: "Ukraine" } },
      expectedValue: "Ukraine",
    },
    {
      title:
        "when both defaultCountry and input defaultValue are set for addressType US",
      overrides: { defaultCountry: "US", addressType: "US" },
      inputOverrides: { country: { defaultValue: "Ukraine" } },
      expectedValue: "Ukraine",
    },
  ])("$title", ({ overrides, inputOverrides, expectedValue }) => {
    beforeEach(() => {
      renderAddressField(overrides, inputOverrides);
    });

    it("renders hidden country input with correct value", () => {
      const hiddenInput = container.querySelector(
        'input[type="hidden"][name="input_8.6"]'
      );

      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput.value).toBe(expectedValue);
    });
  });
});
