function scrollToElement(el, offset = 0) {
  if (
    el &&
    typeof window !== "undefined" &&
    typeof window.scrollTo === "function"
  ) {
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
    });
  }
}

export default scrollToElement;
