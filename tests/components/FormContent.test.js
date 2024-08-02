// tests for checking Heading (title + description) and confirmation

import { screen, fireEvent, act } from "@testing-library/react";
import renderGravityForm from "./render";
import strings from "../../src/utils/strings";
import mockFormData from "../mocks/formData";

jest.mock("../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Form content + confirmation", () => {
  const fields = [
    {
      id: 4,
      type: "TEXT",
      label: "Single",
    },
    {
      id: 5,
      type: "TEXT",
      label: "Second",
    },
  ];

  // needed to check query string
  const nodes = [
    {
      id: 1,
      type: "TEXT",
      label: "Single",
      defaultValue: "Preset test",
    },
    {
      id: 2,
      type: "EMAIL",
      label: "Email",
      defaultValue: "presettest@gmail.com",
    },
    {
      id: 3,
      type: "TEXTAREA",
      label: "Textarea",
      defaultValue: "Preset textarea",
    },
    {
      id: 4,
      type: "SELECT",
      label: "Select",
      choices: [
        {
          isSelected: false,
          text: "First Choice",
          value: "First Choice",
        },
        {
          isSelected: true,
          text: "Third Choice",
          value: "third",
        },
      ],
    },
    {
      id: 5,
      type: "MULTISELECT",
      isMultiselectField: true,
      label: "Multiselect",
      choices: [
        {
          isSelected: false,
          text: "Test",
          value: "test",
        },
        {
          isSelected: true,
          text: "First Choice",
          value: "first",
        },
        {
          isSelected: true,
          text: "Third Choice",
          value: "third",
        },
      ],
    },
    {
      id: 6,
      type: "CHECKBOX",
      label: "Checkbox",
      choices: [
        {
          isSelected: true,
          text: "First Choice",
          value: "first",
        },
        {
          isSelected: true,
          text: "Third Choice",
          value: "third",
        },
        {
          isSelected: false,
          text: "Fouthh",
          value: "Fouthh",
        },
      ],
      inputs: [
        {
          id: 6.1,
          name: "",
          label: "First Choice",
        },
        {
          id: 6.2,
          name: "",
          label: "Third Choice",
        },
        {
          id: 6.3,
          name: "",
          label: "Fouthh",
        },
      ],
    },
    {
      id: 7,
      type: "RADIO",
      label: "Radio",
      choices: [
        {
          isSelected: true,
          text: "Second Choice",
          value: "second",
        },
        {
          isSelected: false,
          text: "Third Choice",
          value: "Third Choice",
        },
      ],
    },
    {
      type: "NAME",
      label: "Name",
      id: 8,
      inputs: [
        {
          label: "Prefix",
          id: 8.2,
          name: "prefix",
          defaultValue: "prefix",
          key: "prefix",
        },
        {
          label: "First",
          id: 8.3,
          name: "first",
          defaultValue: "first",
          key: "first",
        },
      ],
    },
    {
      id: 9,
      type: "DATE",
      dateFormat: "DMY_DASH",
      dateType: "FIELD",
      descriptionPlacement: "INHERIT",
      label: "Date",
      inputs: [
        {
          id: 9.1,
          label: "Month",
          defaultValue: "10",
        },
        {
          id: 9.2,
          label: "Day",
          defaultValue: "30",
        },
        {
          id: 9.3,
          label: "Year",
          defaultValue: "2024",
        },
      ],
    },
  ];

  beforeAll(() => {
    delete window.location;
    window.location = { href: "" };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("renders title and description", async () => {
    renderGravityForm({
      data: {
        gfForm: {
          title: "Test title",
          description: "test description",
          formFields: { nodes: fields },
        },
      },
    });
    const titleElement = screen.getByText("Test title");
    const descElement = screen.getByText("test description");

    expect(titleElement).toBeInTheDocument();
    expect(descElement).toBeInTheDocument();

    expect(titleElement.tagName).toBe("H2");
    expect(titleElement).toHaveClass("gform_title");

    expect(descElement).toHaveClass("gform_description");
  });

  it("renders error: at least one field must be filled in", async () => {
    renderGravityForm({
      data: {
        gfForm: {
          formFields: { nodes: fields },
        },
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    const errorElement = screen.getByText(strings.errors.leastOneField);

    expect(errorElement).toBeInTheDocument();

    expect(errorElement.parentElement).toHaveClass("gform_validation_errors");
  });

  it("MESSAGE confirmation", async () => {
    renderGravityForm({
      data: {
        gfForm: {
          formFields: { nodes: fields },
        },
      },
    });

    fireEvent.input(screen.getByLabelText(/Single/i), {
      target: {
        value: "test",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(
      screen.getByText(
        mockFormData.gfForm.confirmations.find((e) => e.isActive).message
      )
    ).toBeInTheDocument();
  });

  it("PAGE confirmation", async () => {
    const link = "https://example.com/test";
    renderGravityForm({
      data: {
        gfForm: {
          confirmations: [
            {
              type: "PAGE",
              isActive: true,
              page: {
                node: {
                  link,
                },
              },
            },
          ],
          formFields: { nodes: fields },
        },
      },
    });

    fireEvent.input(screen.getByLabelText(/Single/i), {
      target: {
        value: "test",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(window.location.href).toBe(link);
  });

  it("REDIRECT confirmation", async () => {
    const link = "https://example.com/redirection";
    renderGravityForm({
      data: {
        gfForm: {
          confirmations: [
            {
              type: "REDIRECT",
              isActive: true,
              url: link,
            },
          ],
          formFields: { nodes: fields },
        },
      },
    });

    fireEvent.input(screen.getByLabelText(/Single/i), {
      target: {
        value: "test",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(window.location.href).toBe(link);
  });

  it("redirects with form values", async () => {
    const link = "https://example.com/redirection";

    renderGravityForm({
      data: {
        gfForm: {
          confirmations: [
            {
              type: "REDIRECT",
              isActive: true,
              url: link,
              queryString:
                "text={Text:1}&email={Email:2}&textarea={Textar:3}&select={Select:4}&multi={Multi:5}&checkbox={Check:6}&checkbox1={Check:6.1}&radio={Radio:7}&name={Name (First):8.3}&date={Date:9}",
            },
          ],
          formFields: {
            nodes,
          },
        },
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(window.location.href).toBe(
      "https://example.com/redirection?text=Preset+test&email=presettest%40gmail.com&textarea=Preset+textarea&select=third&multi=First+Choice&checkbox=First+Choice%2C+Third+Choice&checkbox1=First+Choice&radio=second&name=first&date=30-10-2024"
    );
  });

  it("renders TEXT confirmation with form values", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: {
          confirmations: [
            {
              type: "MESSAGE",
              isActive: true,
              message:
                "Thanks for contacting us! We will get in touch with you shortly.\r\n\\n\r\n{Text:1}\r\n\r\n{Radiobuttons:7}\r\n\r\n{Multiselect:5}\r\n\r\n{Checkboxes:6}",
            },
          ],
          formFields: {
            nodes,
          },
        },
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(
      container.querySelector(".gform_confirmation_message").innerHTML
    ).toBe(
      "Thanks for contacting us! We will get in touch with you shortly.<br>\\n<br>Preset test<br><br>second<br><br>First Choice<br><br>First Choice, Third Choice"
    );
  });
});
