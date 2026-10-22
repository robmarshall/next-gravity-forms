const getColumnKey = (choice, index) => choice?.value || choice?.text || index;

/**
 * Builds columns from choices, falling back to a single column with the field label.
 *
 * @param {Object} field - List field configuration.
 * @param {Array<{ value?: string, text?: string }>} [field.choices] - Column choices.
 * @param {boolean} [field.hasColumns] - Whether to use choices as separate columns.
 * @param {string} field.label - Label used for the single-column fallback.
 * @returns {Array<{ key: string | number, label: string | undefined }>} Columns to render.
 */
export const getColumns = ({ choices, hasColumns, label }) => {
  if (hasColumns && choices?.length > 0) {
    return choices.map((choice, index) => ({
      key: getColumnKey(choice, index),
      label: choice.text || choice.value,
    }));
  }

  return [{ key: "value", label }];
};

/**
 * Creates a row with an empty string for every column key.
 *
 * @param {Array<{ key: string | number }>} columns - Columns included in the row.
 * @returns {Object<string, string>} Empty row indexed by column key.
 */
export const getEmptyRow = (columns) =>
  columns.reduce((row, column) => ({ ...row, [column.key]: "" }), {});

/**
 * Normalizes list values into row objects, supplying missing columns with empty strings.
 * Scalar rows populate the first column, with falsy values becoming empty strings.
 * Empty arrays and non-array values produce one empty row.
 *
 * @param {*} value - Current list value to normalize.
 * @param {Array<{ key: string | number }>} columns - Non-empty list of columns.
 * @returns {Array<Object<string, *>>} Row objects with all configured column keys.
 */
export const normalizeRows = (value, columns) => {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((row) =>
      typeof row === "object" && row !== null
        ? { ...getEmptyRow(columns), ...row }
        : { ...getEmptyRow(columns), [columns[0].key]: row || "" }
    );
  }

  return [getEmptyRow(columns)];
};

/**
 * Checks whether any truthy row value has a non-empty string representation after trimming.
 *
 * @param {Object<string, *> | null | undefined} row - Row values indexed by column key.
 * @returns {boolean} Whether the row contains a value other than whitespace or a falsy value.
 */
export const hasRowValue = (row) =>
  Object.values(row || {}).some((value) => String(value || "").trim());
