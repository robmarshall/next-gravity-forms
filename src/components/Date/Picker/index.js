import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Controller } from "react-hook-form";
import { useSettings } from "../../../providers/SettingsContext";
import { valueToLowerCase, interpolateString } from "../../../utils/helpers";
import CalendarIconComponent from "./CalendarIconComponent";
import { isValidDate } from "./helpers";
import { enUS as defaultLocale } from "date-fns/locale";

const DatePicker = lazy(() => import("./LazyPicker"));

// import "react-datepicker/dist/react-datepicker.css";

const dateFormats = {
  mdy: "MM/dd/yyyy",
  dmy: "dd/MM/yyyy",
  dmy_dash: "dd-MM-yyyy",
  dmy_dot: "dd.MM.yyyy",
  ymd_slash: "yyyy/MM/dd",
  ymd_dash: "yyyy-MM-dd",
  ymd_dot: "yyyy.MM.dd",
};

export const getDatePickerDefaultValue = ({ presetValue, defaultValue }) => {
  if (presetValue && isValidDate(new Date(presetValue)))
    return new Date(presetValue);
  if (defaultValue && isValidDate(new Date(defaultValue)))
    return new Date(defaultValue);

  return null;
};

const Picker = ({ fieldData, name, inputId, labelFor, control, errors }) => {
  const {
    isRequired,
    dateFormat: dateFormatUpper,
    placeholder,
    calendarIconType,
    calendarIconUrl,
    errorMessage,
  } = fieldData;
  const {
    strings = {},
    fieldsSettings: { date: dateSettings },
  } = useSettings();

  const calendarIconTypeLower = valueToLowerCase(calendarIconType);
  const dateFormat = valueToLowerCase(dateFormatUpper);

  const { datepicker } = strings;

  const locale = {
    localize: {
      day: (n) => datepicker.days[n],
      month: (n) => datepicker.months[n],
    },
    formatLong: {
      date: () => dateFormats[dateFormat],
    },
    match: defaultLocale.match,
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <Suspense fallback="">
          <DatePicker
            ref={(elem) => {
              elem && ref(elem.input);
            }}
            selected={value}
            id={labelFor}
            name={`input_${inputId}`}
            ariaRequired={isRequired}
            ariaInvalid={errors?.type}
            ariaDescribedBy={`${name}_date_format`}
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
            calendarStartDay={dateSettings.firstDay}
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
        </Suspense>
      )}
      rules={{
        required: isRequired && (errorMessage || strings.errors.required),
        validate: (value) =>
          !value || isValidDate(value)
            ? true
            : interpolateString(strings.errors.date.picker.invalid, {
                format: valueToLowerCase(dateFormats[dateFormat]),
              }),
      }}
    />
  );
};

Picker.propTypes = {
  control: PropTypes.object,
  fieldData: PropTypes.object,
  name: PropTypes.string,
  inputId: PropTypes.number,
  errors: PropTypes.object,
  labelFor: PropTypes.string,
};

export default Picker;
