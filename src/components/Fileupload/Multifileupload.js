import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useDropzone } from "react-dropzone";
import { mimeTypesObject, escHtml } from "./helpers";
import FilePreview from "./FilePreview";
import RejectedFilesList from "./RejectedFilesList";

const MultiFileupload = ({
  name,
  id,
  databaseId,
  accept,
  strings,
  rulesMessages,
  setValue,
  maxFiles,
  maxFileSize,
}) => {
  // Accepted files
  const [files, setFiles] = useState([]);
  // Rejected files
  const [rejectedFiles, setFilesRejected] = useState([]);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
    isFileDialogActive,
  } = useDropzone({
    maxSize: maxFileSize && maxFileSize * 1024 * 1024, // mb to bytes
    // TODO: The GF plugin immediately throws an error when users upload files with risky extensions, such as .js or .exe.
    // Should we implement similar behavior here? If so, how can we determine which file extensions are considered risky?
    // maybe by defining the array of potential risky files with option to override as prop?
    accept: accept?.length > 0 && mimeTypesObject(accept),
    onDrop: (acceptedFiles, fileRejections) => {
      // Initialize a variable for files to be processed
      let filesToProcess = [...files, ...acceptedFiles];
      let excessFiles = [];

      // If maxFiles is a number and less than the number of accepted files, apply the limit
      if (typeof maxFiles === "number" && filesToProcess.length > maxFiles) {
        const allFiles = [...filesToProcess];
        filesToProcess = filesToProcess.slice(0, maxFiles);
        excessFiles = allFiles.slice(maxFiles).map((file) => ({
          file,
          errors: [
            {
              code: "too-many-files",
              message: `File not accepted - exceeds limit of ${maxFiles}.`,
            },
          ],
        }));
      }

      // make sure we escape the name
      const renamedFiles = filesToProcess.map((file) => {
        // Escape html
        const newName = escHtml(file.name);
        // Create a new File object with the updated name
        return new File([file], newName, { type: file.type });
      });

      setFiles(renamedFiles);

      // Combine fileRejections from Dropzone with custom rejections for excess files
      setFilesRejected((prev) => [...prev, ...fileRejections, ...excessFiles]);

      // Update form value if necessary
      setValue(name, renamedFiles, { shouldValidate: true });
    },
  });

  // remove file handler
  const removeFile = (file) => {
    setFilesRejected([]); // Reset rejected files
    const newFiles = files.filter((f) => f !== file);
    setFiles(newFiles);
    // Update form value accordingly
    setValue(name, newFiles, { shouldValidate: true });
  };

  return (
    <>
      <div className="gform_fileupload_multifile">
        <div
          id={`gform_drag_drop_area_${databaseId}_${id}`}
          className={classNames(
            "gform_drop_area gform-theme-field-control",
            isFocused && "is-focused",
            isDragAccept && "is-drag-accept",
            isDragReject && "is-drag-reject",
            isDragActive && "is-drag-active",
            isFileDialogActive && "is-file-dialog-active"
          )}
          {...getRootProps()}
          style={{}} // empty obj to remove styles
        >
          <input {...getInputProps()} />
          {/* use dangerouslySetInnerHTML so user is able to add custom html also */}
          {strings.fileupload.multiFileUpload.drop && (
            <span
              className="gform_drop_instructions"
              dangerouslySetInnerHTML={{
                __html: strings.fileupload.multiFileUpload.drop,
              }}
            />
          )}
          {strings.fileupload.multiFileUpload.select && (
            <button
              type="button"
              id={`gform_browse_button_${databaseId}_${id}`}
              className="button gform_button_select_files"
              aria-describedby={`gfield_upload_rules_${databaseId}_${id}`}
              aria-label="select files, multiupload"
              dangerouslySetInnerHTML={{
                __html: strings.fileupload.multiFileUpload.select,
              }}
            />
          )}
        </div>
      </div>

      {rulesMessages}

      {rejectedFiles?.length > 0 && (
        <RejectedFilesList
          rejectedFiles={rejectedFiles}
          strings={strings}
          id={`gform_multifile_messages_${databaseId}_${id}`}
          accept={accept}
        />
      )}

      {files?.length > 0 && (
        <FilePreview
          databaseId={databaseId}
          id={id}
          files={files}
          strings={strings}
          removeFile={(file) => removeFile(file)}
        />
      )}
    </>
  );
};

MultiFileupload.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number,
  databaseId: PropTypes.number,
  accept: PropTypes.array,
  strings: PropTypes.object,
  maxFileSize: PropTypes.number,
  maxFiles: PropTypes.number,
  rulesMessages: PropTypes.string,
  setValue: PropTypes.func,
};

export default MultiFileupload;
