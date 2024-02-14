import React from "react";
import { interpolateString } from "../../utils/helpers";

const FilePreview = ({ removeFile, strings, files, databaseId, id }) => {
  if (!files.length > 0) return null;

  return (
    <div
      id={`gform_preview_${databaseId}_${id}`}
      className="ginput_preview_list"
    >
      {files.map((file, i) => (
        <div className="ginput_preview" key={`${file.name}-${i}`}>
          {file.name && (
            <span
              className="gfield_fileupload_filename"
              dangerouslySetInnerHTML={{ __html: file.name }}
            />
          )}
          <button
            className="gform_delete_file gform-theme-button gform-theme-button--simple"
            onClick={() => removeFile(file)}
          >
            <span className="dashicons dashicons-trash" aria-hidden="true">
              &#128465;
            </span>
            <span className="screen-reader-text">
              {interpolateString(strings.fileupload.deleteFile, {
                name: file.name,
              })}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilePreview;
