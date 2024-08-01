import { number, object } from "prop-types";
import React from "react";

const Confirmation = ({ databaseId, confirmation }) => {
  return (
    <>
      <div className="gform_anchor" id={`gf_${databaseId}`} />
      <div className="gform_confirmation_wrapper">
        <div
          className="gform_confirmation_message"
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={{ __html: confirmation?.message }}
        />
      </div>
    </>
  );
};

Confirmation.propTypes = {
  databaseId: number.isRequired,
  confirmation: object,
};

export default Confirmation;
