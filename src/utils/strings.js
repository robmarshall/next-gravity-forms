const strings = {
  errors: {
    general:
      "There was a problem with your submission. Errors have been highlighted below.",
    leastOneField: "At least one field must be filled out.",
    unknownError: "An unknown error occured.",
    required: "This field is required.",
    emailsDontmatch: "Your emails do not match.",
    wrongRangeMin: "Please enter a number greater than or equal to {{min}}.",
    wrongRangeMax: "Please enter a number less than or equal to {{max}}.",
    wrongRangeBoth: "Please enter a number from {{min}} to {{max}}.",
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
  },
};

export default strings;
