// SettingsProvider component for managing global settings
import React, { createContext, useContext } from "react";
import strings from "../utils/strings";
import mergeDeep from "../utils/mergeDeep";

const SettingsContext = createContext();

export const SettingsProvider = ({ helperText, children }) => {
  // Override custom strings with helperText object, allowing users to modify hardcoded strings
  const mergedStrings = mergeDeep(strings, helperText);

  return (
    <SettingsContext.Provider value={{ strings: mergedStrings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

SettingsProvider.propTypes = {
  helperText: PropTypes.object,
  children: PropTypes.node.isRequired,
};
