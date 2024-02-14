import React, { useState } from "react";
import classNames from "classnames";
import { useDropzone } from "react-dropzone";
import { mimeTypesObject } from "./helpers";
import FilePreview from "./FilePreview";

const MultiFileupload = ({
  name,
  id,
  databaseId,
  accept,
  strings,
  rulesMessages,
  setValue,
}) => {
  const [files, setFiles] = useState([]);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
    isFileDialogActive,
    fileRejections,
  } = useDropzone({
    accept: accept?.length > 0 && mimeTypesObject(accept),
    onDrop: (acceptedFiles) => {
      const renamedFiles = acceptedFiles.map((file) => {
        // Remove spaces from the file name and replace them with dashes
        const newName = file.name.replace(/\s/g, "-");
        // Create a new File object with the updated name
        return new File([file], newName, { type: file.type });
      });

      setFiles((prevFiles) => [...prevFiles, ...renamedFiles]);
      // Update form value if necessary
      setValue(name, [...files, ...renamedFiles], { shouldValidate: true });
    },
  });

  const removeFile = (file) => {
    const newFiles = files.filter((f) => f !== file);
    setFiles(newFiles);
    // Update form value accordingly
    setValue(name, newFiles, { shouldValidate: true });
  };

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  console.log({ fileRejections });

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
          {strings.fileupload.multifileUpload.drop && (
            <span
              className="gform_drop_instructions"
              dangerouslySetInnerHTML={{
                __html: strings.fileupload.multifileUpload.drop,
              }}
            />
          )}
          {strings.fileupload.multifileUpload.select && (
            <button
              type="button"
              id={`gform_browse_button_${databaseId}_${id}`}
              className="button gform_button_select_files"
              aria-describedby={`gfield_upload_rules_${databaseId}_${id}`}
              aria-label="select files, multiupload"
              dangerouslySetInnerHTML={{
                __html: strings.fileupload.multifileUpload.select,
              }}
            />
          )}
        </div>
      </div>

      {rulesMessages}

      {files?.length > 0 && (
        <FilePreview
          databaseId={databaseId}
          id={id}
          files={files}
          strings={strings}
          removeFile={(file) => removeFile(file)}
        />
      )}

      <ul
        class="validation_message--hidden-on-empty gform-ul-reset"
        id={`gform_multifile_messages_${databaseId}_${id}`}
      >
        <li class="gfield_description gfield_validation_message">
          ainspector-all-rules-2024-02-05-15h-50m-31s.csv - This type of file is
          not allowed. Must be one of the following: pdf
        </li>
      </ul>
    </>
  );
};

export default MultiFileupload;
