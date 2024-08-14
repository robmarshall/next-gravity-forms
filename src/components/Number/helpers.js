import { interpolateString, valueToLowerCase } from "../../utils/helpers";

const getRangeMessage = (message, rangeMinValue, rangeMaxValue) => {
  return interpolateString(message, {
    min: `<strong>${rangeMinValue}</strong>`,
    max: `<strong>${rangeMaxValue}</strong>`,
  });
};

export const getRangeValidation = (
  rangeMinValue,
  rangeMaxValue,
  strings,
  customErrorText
) => {
  // Determine the error message templates
  let minMessage = customErrorText || strings.errors.number?.wrongRangeMin;
  let maxMessage = customErrorText || strings.errors.number?.wrongRangeMax;

  if (rangeMinValue && rangeMaxValue) {
    minMessage = customErrorText || strings.errors.number?.wrongRangeBoth;
    maxMessage = customErrorText || strings.errors.number?.wrongRangeBoth;
  }

  const createErrorObject = (value, message) => {
    if (value !== null)
      return {
        value,
        message: getRangeMessage(message, rangeMinValue, rangeMaxValue),
      };

    return null;
  };

  return {
    min: createErrorObject(rangeMinValue, minMessage),
    max: createErrorObject(rangeMaxValue, maxMessage),
  };
};

export const getRangeInstruction = (rangeMinValue, rangeMaxValue, strings) => {
  if (rangeMinValue && rangeMaxValue) {
    return getRangeMessage(
      strings.errors.number?.wrongRangeBoth,
      rangeMinValue,
      rangeMaxValue
    );
  } else if (rangeMinValue) {
    return getRangeMessage(
      strings.errors.number?.wrongRangeMin,
      rangeMinValue,
      rangeMaxValue
    );
  } else if (rangeMaxValue) {
    return getRangeMessage(
      strings.errors.number?.wrongRangeMax,
      rangeMinValue,
      rangeMaxValue
    );
  }

  return null;
};

/**
 * Custom hook for managing range-related utilities including validation and instruction messages.
 *
 * @param {Object} range - The range object containing minValue and maxValue.
 * @param {number|null} range.minValue - The minimum value of the range.
 * @param {number|null} range.maxValue - The maximum value of the range.
 * @param {boolean|null} error - Error flag indicating the presence of an error, if any.
 * @param {string|null} customErrorText - Custom error message text, if any.
 * @returns {Object} An object containing range validation, instruction message, and a flag to show instruction.
 */
export const getRangeUtilities = ({
  strings,
  range: { minValue, maxValue },
  isError,
  customErrorText,
}) => {
  const rangeValidation = getRangeValidation(
    minValue,
    maxValue,
    strings,
    customErrorText
  );

  const rangeInstruction = getRangeInstruction(minValue, maxValue, strings);

  const showInstruction = rangeInstruction && !customErrorText && !isError;

  return { rangeValidation, rangeInstruction, showInstruction };
};

const numberFormat = (number, decimals, dec_point, thousands_sep) => {
  // Strip all characters but numerical ones.
  number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "",
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const toMoney = (number, currency) => {
  if (isNaN(number)) {
    number = parseFloat(number);
  }

  if (isNaN(number)) {
    return "";
  }

  let negative = "";
  if (number < 0) {
    negative = "-";
    number = Math.abs(number);
  }

  const money = numberFormat(
    number,
    currency.decimals,
    currency.decimal_separator,
    currency.thousand_separator
  );

  if (money === "0.00") {
    negative = "";
  }

  const symbol_left = currency.symbol_left
    ? currency.symbol_left + (currency.symbol_padding || "")
    : "";
  const symbol_right = currency.symbol_right
    ? (currency.symbol_padding || "") + currency.symbol_right
    : "";

  return negative + symbol_left + money + symbol_right;
};

export const formatNumber = (
  value,
  format,
  currency = {
    symbol_left: "",
    symbol_right: "€",
    symbol_padding: " ",
    thousand_separator: ".",
    decimal_separator: ",",
    decimals: 2,
  },
  include_thousands_sep = false
) => {
  const number_format = valueToLowerCase(format);

  let dec_point, thousands_sep;

  if (number_format === "decimal_comma") {
    dec_point = ",";
    thousands_sep = include_thousands_sep ? "." : "";
  } else {
    dec_point = ".";
    thousands_sep = include_thousands_sep ? "," : "";
  }

  let number = value;

  if (!isNumeric(number)) {
    number = numberFormat(
      number,
      currency?.decimals || 0,
      dec_point,
      thousands_sep
    );
  }

  if (number_format == "currency") {
    return toMoney(number, currency);
  }

  const is_negative = number < 0;
  number = Math.abs(number);

  let formattedNumber = numberFormat(number, 0, dec_point, thousands_sep);

  if (is_negative) {
    formattedNumber = "-" + formattedNumber;
  }

  return formattedNumber;
};

export const formatValue = (
  value,
  numberFormat,
  currencies,
  globalCUrrency = "EUR"
) => {
  const currency = "currency" === numberFormat && currencies?.[globalCUrrency];

  return formatNumber(value, numberFormat, currency);
};
