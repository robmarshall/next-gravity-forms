// SettingsProvider component for managing global settings
import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import strings from "../utils/strings";
import fieldsSettings from "../utils/fieldsSettings";
import mergeDeep from "../utils/mergeDeep";

const SettingsContext = createContext();

export const getSettings = (helperFieldsSettings) => {
  return mergeDeep(fieldsSettings, helperFieldsSettings);
};

export const SettingsProvider = ({
  helperText,
  helperFieldsSettings,
  children,
  form,
  ...props
}) => {
  // Override custom strings with helperText object, allowing users to modify hardcoded strings
  const mergedStrings = mergeDeep(strings, helperText);
  const mergedSettings = getSettings(helperFieldsSettings);

  return (
    <SettingsContext.Provider
      value={{
        strings: mergedStrings,
        fieldsSettings: mergedSettings,
        databaseId: form.databaseId,
        form,
        ...props,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

SettingsProvider.propTypes = {
  helperText: PropTypes.object,
  form: PropTypes.object.isRequired,
  helperFieldsSettings: PropTypes.object,
  children: PropTypes.node.isRequired,
};
