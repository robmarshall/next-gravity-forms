import React from "react";
import { interpolateString } from "../../utils/helpers";

const FilePreview = ({ name, removeFile, strings, ...props }) => {
  return (
    <div className="ginput_preview">
      {name && (
        <span
          className="gfield_fileupload_filename"
          dangerouslySetInnerHTML={{ __html: name }}
        />
      )}
      <span className="gfield_fileupload_progress gfield_fileupload_progress_complete">
        <span className="gfield_fileupload_progressbar">
          <span
            className="gfield_fileupload_progressbar_progress"
            style={{ width: "100%" }}
          ></span>
        </span>
        <span className="gfield_fileupload_percent">100%</span>
      </span>
      <button
        className="gform_delete_file gform-theme-button gform-theme-button--simple"
        onClick={removeFile}
      >
        <span className="dashicons dashicons-trash" aria-hidden="true"></span>
        <span className="screen-reader-text">
          {interpolateString(strings.fileupload.deleteFile, { name })}
        </span>
      </button>
    </div>
  );
};

export default FilePreview;
