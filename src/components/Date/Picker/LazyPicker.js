import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";

const LazyPicker = forwardRef((props, ref) => {
  return <ReactDatePicker ref={ref} {...props} />;
});

LazyPicker.displayName = "ReactDatePicker";

export default LazyPicker;
