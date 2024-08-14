// form fields settings what can be overwritten by passing prop helperFieldsSettings prop
const fieldsSettings = {
  // Date Picker settings
  date: {
    dateMinYear: 1920, // option to set min date year
    dateMaxYear: new Date().getFullYear() + 1, // option to set nax date year
    firstDay: 1, // option to change the first date of the week, Monday (1) is default
  },
  number: {
    currencies: {
      USD: {
        symbol_left: "$",
        symbol_right: "",
        symbol_padding: "",
        thousand_separator: ",",
        decimal_separator: ".",
        decimals: 2,
      },
      GBP: {
        symbol_left: "£",
        symbol_right: "",
        symbol_padding: " ",
        thousand_separator: ",",
        decimal_separator: ".",
        decimals: 2,
      },
      EUR: {
        symbol_left: "",
        symbol_right: "€",
        symbol_padding: " ",
        thousand_separator: ".",
        decimal_separator: ",",
        decimals: 2,
      },
    },
  },
};

export default fieldsSettings;
