import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { useSettings } from "../../../providers/SettingsContext";
import { valueToLowerCase } from "../../../utils/helpers";
import CalendarIconComponent from "./CalendarIconComponent";

const dateFormats = {
  mdy: "MM/dd/yyyy",
  dmy: "dd/MM/yyyy",
  dmy_dash: "dd-MM-yyyy",
  dmy_dot: "dd.MM.yyyy",
  ymd_slash: "yyyy/MM/dd",
  ymd_dash: "yyyy-MM-dd",
  ymd_dot: "yyyy.MM.dd",
};

const Picker = ({ fieldData, name, control }) => {
  const {
    isRequired,
    defaultValue,
    dateFormat: dateFormatUpper,
    placeholder,
    calendarIconType,
    calendarIconUrl,
  } = fieldData;
  const { strings: { datepicker } = {} } = useSettings();
  const calendarIconTypeLower = valueToLowerCase(calendarIconType);
  const dateFormat = valueToLowerCase(dateFormatUpper);

  const locale = {
    localize: {
      day: (n) => datepicker.days[n],
      month: (n) => datepicker.months[n],
    },
    formatLong: {
      date: () => dateFormats[dateFormat],
    },
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ? new Date(defaultValue) : null}
      render={({ field: { onChange, value } }) => (
        <>
          <DatePicker
            selected={value}
            id={name}
            onChange={onChange}
            dateFormat={dateFormats[dateFormat]}
            showMonthDropdown
            showYearDropdown
            yearDropdownItemNumber={20}
            dropdownMode="select"
            dateFormatCalendar=" " // hide current month text
            placeholderText={
              placeholder || valueToLowerCase(dateFormats[dateFormat])
            }
            calendarStartDay={
              datepicker.firstDay.value || datepicker.firstDay.default
            }
            showDisabledMonthNavigation
            locale={locale}
            className={classnames(
              "datepicker gform-datepicker hasDatepicker initialized",
              dateFormat,
              calendarIconTypeLower == "none"
                ? "datepicker_no_icon gdatepicker-no-icon"
                : "datepicker_with_icon gdatepicker_with_icon"
            )}
          />
          <CalendarIconComponent
            calendarIconTypeLower={calendarIconTypeLower}
            calendarIconUrl={calendarIconUrl}
            datepicker={datepicker}
          />
          {datepicker.screenReaderText[dateFormat] && (
            <span id={`${name}_date_format`} className="screen-reader-text">
              {datepicker.screenReaderText[dateFormat]}
            </span>
          )}
        </>
      )}
      rules={{ required: isRequired && strings.errors.required }}
    />
  );
};

Picker.propTypes = {
  control: PropTypes.object,
  fieldData: PropTypes.object,
  name: PropTypes.string,
};

export default Picker;
