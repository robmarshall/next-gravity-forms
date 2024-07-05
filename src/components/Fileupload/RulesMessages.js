import React from "react";
import classNames from "classnames";
import { bool, node, number } from "prop-types";

const RulesMessages = ({ isGFValidationError, databaseId, id, children }) => {
  return (
    <span
      className={classNames(
        isGFValidationError && "gform_hidden",
        "gfield_description gform_fileupload_rules"
      )}
      id={`gfield_upload_rules_${databaseId}_${id}`}
    >
      {children}
    </span>
  );
};

RulesMessages.propTypes = {
  isGFValidationError: bool.isRequired,
  databaseId: number.isRequired,
  id: number.isRequired,
  children: node.isRequired,
};

export default RulesMessages;
