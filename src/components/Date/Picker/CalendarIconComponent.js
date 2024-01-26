import React from "react";
import PropTypes from "prop-types";
import CalendarIcon from "../../../assets/img/datepicker";

const CalendarIconComponent = ({
  calendarIconTypeLower,
  calendarIconUrl,
  datepicker,
}) => {
  if (calendarIconTypeLower === "none") return null;
  if (calendarIconTypeLower === "calendar")
    return <CalendarIcon className="ui-datepicker-trigger" />;
  if (calendarIconTypeLower === "custom") {
    return (
      <img
        className="ui-datepicker-trigger"
        src={calendarIconUrl}
        alt={datepicker.iconText}
        title={datepicker.iconText}
      />
    );
  }
  return null;
};

CalendarIconComponent.propTypes = {
  calendarIconTypeLower: PropTypes.string.isRequired,
  calendarIconUrl: PropTypes.string,
  datepicker: PropTypes.object.isRequired,
};

export default CalendarIconComponent;
