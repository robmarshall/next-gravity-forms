import React from "react";
import PropTypes from "prop-types";
import { interpolateString } from "../../utils/helpers";
import { getAllowedTypesList } from "./helpers";

const RejectedFilesList = ({ rejectedFiles, id, strings, accept }) => {
  if (!rejectedFiles?.length > 0) return null;

  // We should show only `too-many-files` error only once
  const hasTooManyFilesError = (item) =>
    item.errors.some((error) => error.code === "too-many-files");

  const files = rejectedFiles.reduce(
    (acc, item) => {
      // If the item has a "too-many-files" error and we haven't added such an item yet, add it and mark the flag.
      if (hasTooManyFilesError(item)) {
        if (!acc.isTooManyAdded) {
          acc.items.push(item);
          acc.isTooManyAdded = true; // Mark that we've added an item with "too-many-files"
        }
      } else {
        acc.items.push(item); // Add item if it doesn't have the "too-many-files" error.
      }

      return acc;
    },
    { items: [], isTooManyAdded: false }
  ).items;

  // Get error message based on error code from strings
  const getFileError = (file, { code, message }) => {
    switch (code) {
      case "file-too-large":
        return interpolateString(
          strings.errors.multiFileUpload.exceedsSizeLimit,
          { name: file.name }
        );
      case "file-invalid-type":
        return interpolateString(
          strings.errors.multiFileUpload.typeNotAllowed,
          { types: getAllowedTypesList(accept), name: file.name }
        );
      case "too-many-files":
        return strings.errors.multiFileUpload.maxFiles;
      default:
        return message;
    }
  };

  return (
    <ul className="validation_message--hidden-on-empty gform-ul-reset" id={id}>
      {files.map(({ file, errors: [error] }, i) => (
        <li
          key={`${file.name}-${i}`}
          className="gfield_description gfield_validation_message"
        >
          {getFileError(file, error)}
        </li>
      ))}
    </ul>
  );
};

RejectedFilesList.propTypes = {
  rejectedFiles: PropTypes.array,
  strings: PropTypes.object,
  id: PropTypes.number,
  accept: PropTypes.array,
};

export default RejectedFilesList;
