import { string } from "prop-types";
import React from "react";

const FormHeading = ({ title, description }) => {
  return (
    <div className="gform_heading">
      {title && (
        <h2
          className="gform_title"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {description && (
        <p
          className="gform_description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {/* TODO add indicator */}
      {/* <p className="gform_required_legend">
        <span className="gfield_required gfield_required_custom">(Required)</span>{" "}
        indicates required fields
      </p> */}
    </div>
  );
};

FormHeading.propTypes = {
  title: string,
  description: string,
};

export default FormHeading;
