import "@testing-library/jest-dom";

// needed to make scrollTo work in tests
const noop = () => {};
Object.defineProperty(window, "scrollTo", { value: noop, writable: true });
