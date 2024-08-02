import { number, object } from "prop-types";
import React from "react";

const Confirmation = ({ databaseId, confirmation }) => {
  return (
    <>
      <div className="gform_anchor" id={`gf_${databaseId}`} />
      {confirmation?.message && (
        <div className="gform_confirmation_wrapper">
          <div
            className="gform_confirmation_message"
            dangerouslySetInnerHTML={{
              __html: confirmation.message.replace(/\r?\n/g, "<br />"),
            }}
          />
        </div>
      )}
    </>
  );
};

Confirmation.propTypes = {
  databaseId: number.isRequired,
  confirmation: object,
};

export default Confirmation;
