const strings = {
  errors: {
    general:
      "There was a problem with your submission. Errors have been highlighted below.",
    leastOneField: "At least one field must be filled out.",
    unknownError: "An unknown error occured.",
    required: "This field is required.",
    emailsDontmatch: "Your emails do not match.",
    pattern: {
      email:
        "The email address entered is invalid, please check the formatting (e.g. email@domain.com).",
      phone: "This is an invalid phone number.",
      default: "The format seems to be wrong.",
    },
    maxChar: {
      front: "Need more than",
      back: "characters.",
    },
    name: "Please complete the following fields: {{fields}}",
    date: {
      required: "Please complete the following fields: {{fields}}",
      invalid: "Please enter a valid date.",
      picker: {
        invalid: "Please enter a valid date in the format ({{format}}).",
      },
    },
  },
  datepicker: {
    days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    iconText: "Select date",
    screenReaderText: {
      mdy: "MM slash DD slash YYYY",
      dmy: "DD slash MM slash YYYY",
      dmy_dash: "DD dash MM dash YYYY",
      dmy_dot: "DD dot MM dot YYYY",
      ymd_slash: "YYYY slash MM slash DD",
      ymd_dash: "YYYY dash MM dash DD",
      ymd_dot: "YYYY dot MM dot DD",
    },
  },
  honeypot:
    "This field is for validation purposes and should be left unchanged.",
  multiselect: {
    placeholder: "Click to select...",
  },
};

export default strings;
