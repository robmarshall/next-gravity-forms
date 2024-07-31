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
    name: "Please complete the following fields: {{fields}}",
    date: {
      required: "Please complete the following fields: {{fields}}",
      invalid: "Please enter a valid date.",
      picker: {
        invalid: "Please enter a valid date in the format ({{format}}).",
      },
    },
    fileupload: {
      exceedsSizeLimit: "File exceeds size limit. Maximum file size: {{max}}MB",
      typeNotAllowed:
        "The uploaded file type is not allowed. Must be one of the following: {{types}}",
    },
    multiFileUpload: {
      exceedsSizeLimit: "{{name}} - File exceeds size limit",
      typeNotAllowed:
        "{{name}} - This type of file is not allowed. Must be one of the following: {{types}}",
      maxFiles: "Maximum number of files reached",
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
    name: "Please complete the following fields: {{fields}}",
  },
  checkboxes: {
    selectAll: "Select All",
    deselectAll: "Deselect All",
  },
  radio: {
    otherChoiceLabel: "Other Choice, please specify",
    // add the field ID, i.e., otherChoice_3, to override it for the specific field only.
    otherChoice: "Other",
  },
  honeypot:
    "This field is for validation purposes and should be left unchanged.",
  multiselect: {
    placeholder: "Click to select...",
  },
  fileupload: {
    acceptedFiles: "Accepted file types: {{types}}",
    maxFileSize: "Max. file size: {{max}}",
    maxFiles: "Max. files: {{max}}",
    deleteFile: "Delete this file: {{name}}",
    multiFileUpload: {
      drop: "Drop files here or ",
      select: "Select files",
    },
  },
  loading: "Loading...",
  submit: "Submit",
  step: "Step {{step}} of {{total}}",
};

export default strings;
