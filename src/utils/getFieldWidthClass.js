/**
 * Retrieves a CSS class name that represents the width of a field based on its grid column span.
 *
 * @param {number} layoutGridColumnSpan - The number of columns that the field spans in the grid layout.
 * @returns {string|null} The corresponding CSS class name for the given column span, or null if no match is found.
 */
export const getFieldWidthClass = (layoutGridColumnSpan) => {
  const fieldWidthMap = {
    12: "full",
    11: "twelfths",
    10: "sixths",
    9: "three-quarter",
    8: "two-thirds",
    7: "seven-twelfths",
    6: "half",
    5: "five-twelfths",
    4: "third",
    3: "quarter",
  };

  return fieldWidthMap[layoutGridColumnSpan] ?? null;
};
