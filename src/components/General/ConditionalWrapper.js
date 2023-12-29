// eslint-disable-next-line no-unused-vars
import React from "react";
const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;
export default ConditionalWrapper;
