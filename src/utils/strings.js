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
  },
  checkboxes: {
    selectAll: "Select All",
    deselectAll: "Deselect All",
  },
  honeypot:
    "This field is for validation purposes and should be left unchanged.",
  multiselect: {
    placeholder: "Click to select...",
  },
};

export default strings;
