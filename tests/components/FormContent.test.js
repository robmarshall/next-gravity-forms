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

  it("renders error at least one field must be filled it error", async () => {
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
});
