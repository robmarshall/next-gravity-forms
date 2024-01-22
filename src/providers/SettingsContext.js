// SettingsProvider component for managing global settings
import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import strings from "../utils/strings";
import fieldsSettings from "../utils/fieldsSettings";
import mergeDeep from "../utils/mergeDeep";

const SettingsContext = createContext();

export const SettingsProvider = ({ helperText, databaseId, children }) => {
  // Override custom strings with helperText object, allowing users to modify hardcoded strings
  const mergedStrings = mergeDeep(strings, helperText);

  return (
    <SettingsContext.Provider
      value={{ strings: mergedStrings, fieldsSettings, databaseId }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

SettingsProvider.propTypes = {
  helperText: PropTypes.object,
  children: PropTypes.node.isRequired,
};
