import { interpolateString } from "../../utils/helpers";

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

  return rules.join(". ");
}

// validate max file size
export function validateMaxFileSize(files, maxFileSize) {
  const maxFileSizeBytes = maxFileSize && maxFileSize * 1024 * 1024; // Convert MB to Bytes

  if (!files instanceof Array || !maxFileSize) return false;
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
