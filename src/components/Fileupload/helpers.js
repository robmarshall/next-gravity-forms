import { interpolateString } from "../../utils/helpers";
import mime from "mime-types";

export function getAllowedTypesList(allowedExtensions) {
  if (!allowedExtensions instanceof Array) return "";
  return allowedExtensions.join(", ");
}

export function getRulesMessages(rul, strings) {
  const { allowedExtensions, maxFileSize, maxFiles } = rul;
  const rules = [];
  if (allowedExtensions?.length > 0)
    rules.push(
      interpolateString(strings.fileupload.acceptedFiles, {
        types: getAllowedTypesList(allowedExtensions),
      })
    );
  if (maxFileSize)
    rules.push(
      interpolateString(strings.fileupload.maxFileSize, {
        max: `${maxFileSize}MB`,
      })
    );

  if (maxFiles > 1)
    rules.push(
      interpolateString(strings.fileupload.maxFiles, { max: maxFiles })
    );

  // Join rules with ". " and ensure a trailing dot if rules is not empty
  return rules.length > 0 ? rules.join(". ") + "." : "";
}

// validate max file size
export function validateMaxFileSize(files, maxFileSize) {
  const maxFileSizeBytes = maxFileSize && maxFileSize * 1024 * 1024; // Convert MB to Bytes

  if (!files || !files instanceof Array || !maxFileSize) return false;
  for (let i = 0; i < files.length; i++) {
    if (maxFileSizeBytes && files[i].size > maxFileSizeBytes) {
      return true;
    }
  }
}

// validate type
export function validateType(files, allowedExtensions) {
  if (!files instanceof Array || !allowedExtensions instanceof Array)
    return false;
  for (let i = 0; i < files.length; i++) {
    const fileExtension = files[i].name.split(".").pop().toLowerCase();
    if (
      !allowedExtensions.includes("*") &&
      !allowedExtensions.includes(fileExtension)
    ) {
      return true;
    }
  }
}

export function cleanAllowedExtensions(extensions) {
  if (!Array.isArray(extensions)) {
    return [];
  }
  return extensions.map((ext) => ext.trim().replace(/\s/g, ""));
}

// convert array of allowed extensions into react-dropzone format
export const mimeTypesObject = (extensions) => {
  return extensions.reduce((acc, ext) => {
    const mimeType = mime.lookup(ext);
    if (mimeType) {
      acc[mimeType] = acc[mimeType] || [];
      acc[mimeType].push(`.${ext}`);
    }
    return acc;
  }, {});
};

export const validateMaxSizeRule = (value, maxFileSize, strings) => {
  if (!value || !maxFileSize > 0) return true;
  return (
    validateMaxFileSize(value, maxFileSize) &&
    interpolateString(strings.errors.fileupload.exceedsSizeLimit, {
      max: maxFileSize,
    })
  );
};

export const validateExtRule = (value, allowedExtensions, strings) => {
  if (!value || !allowedExtensions?.length > 0) return true;
  return (
    validateType(value, allowedExtensions) &&
    interpolateString(strings.errors.fileupload.typeNotAllowed, {
      types: getAllowedTypesList(allowedExtensions),
    })
  );
};

// escape filename
export const escHtml = (filename) => {
  // Regular expression to match any character that is not a letter, number, hyphen, underscore, or period
  const illegalRe = /[^a-zA-Z0-9-.]+/g;
  // Split the filename into name and extension
  let [name, extension] = filename.split(".").reduce(
    (acc, val, i, arr) => {
      if (i === arr.length - 1) {
        // Last item, should be extension
        acc[1] = val;
      } else {
        // Accumulate name parts (if filename has multiple periods)
        acc[0] += (i ? "." : "") + val;
      }
      return acc;
    },
    ["", ""]
  );

  // Remove illegal characters from the name part
  name = name.replace(illegalRe, "");

  // Return the sanitized name with its extension, if it had one
  return extension ? `${name}.${extension}` : name;
};
