import React, { useMemo } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import InputWrapper from "../../components/InputWrapper";
import { Input } from "../General";
import { parseTimeDefaultValue } from "./helpers";
import { useSettings } from "../../providers/SettingsContext";

const INPUT_LABELS = ["hour", "minute", "ampm"];

const TimeField = ({ fieldData, name, labelFor, wrapClassName, wrapId }) => {
  const { cssClass, inputs, timeFormat, isRequired, errorMessage } = fieldData;
  if (!inputs || inputs.length === 0) return null;

  const shouldRenderAmpm = timeFormat !== "H24";
  const partOrder = shouldRenderAmpm
    ? ["hour", "minute", "ampm"]
    : ["hour", "minute"];

  const visibleInputs = useMemo(
    () => (shouldRenderAmpm ? inputs : inputs.slice(0, 2)),
    [inputs, shouldRenderAmpm]
  );

  const timeParts = useMemo(
    () =>
      visibleInputs.map((input, index) => ({
        input,
        part: INPUT_LABELS[index],
        index,
      })),
    [visibleInputs]
  );

  const { strings } = useSettings();

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const getValidationMessage = () => errorMessage || strings?.errors?.time;

  const getRequiredMessage = () => errorMessage || strings?.errors?.required;

  const normalizeValue = (value) => {
    if (!value) return {};
    if (typeof value === "string") {
      return parseTimeDefaultValue(value, inputs, timeFormat) || {};
    }
    return value;
  };

  const evaluateTimeValue = (rawValue = {}) => {
    const normalizedValue = normalizeValue(rawValue) || {};
    const { hour, minute, ampm } = normalizedValue;

    const hasHour = hour !== undefined && hour !== "";
    const hasMinute = minute !== undefined && minute !== "";

    if (!hasHour && !hasMinute) {
      if (!isRequired) {
        return { normalizedValue };
      }

      return {
        normalizedValue,
        invalidPart: partOrder[0],
        errorMessage: getRequiredMessage(),
      };
    }

    if (!hasHour || !hasMinute) {
      return {
        normalizedValue,
        invalidPart: !hasHour ? "hour" : "minute",
        errorMessage: getValidationMessage(),
      };
    }

    const hourNumber = Number(hour);
    const minuteNumber = Number(minute);

    if (Number.isNaN(hourNumber) || Number.isNaN(minuteNumber)) {
      return {
        normalizedValue,
        invalidPart: Number.isNaN(hourNumber) ? "hour" : "minute",
        errorMessage: getValidationMessage(),
      };
    }

    const minHour = shouldRenderAmpm ? 1 : 0;
    const maxHour = shouldRenderAmpm ? 12 : 24;
    const maxMinute = hourNumber >= 24 ? 0 : 59;

    if (
      hourNumber < minHour ||
      hourNumber > maxHour ||
      minuteNumber < 0 ||
      minuteNumber > maxMinute
    ) {
      return {
        normalizedValue,
        invalidPart:
          hourNumber < minHour ||
          hourNumber > maxHour ||
          minuteNumber > maxMinute
            ? "hour"
            : "minute",
        errorMessage: getValidationMessage(),
      };
    }

    if (shouldRenderAmpm && !ampm) {
      return {
        normalizedValue,
        invalidPart: "ampm",
        errorMessage: getValidationMessage(),
      };
    }

    return { normalizedValue };
  };

  const validateTime = (value = {}) => {
    const { errorMessage } = evaluateTimeValue(value);
    return errorMessage || true;
  };

  const renderNumericInput = ({
    input,
    part,
    index,
    value,
    onChange,
    focusPart,
    ref,
  }) => {
    const isHour = part === "hour";
    const max = isHour ? (shouldRenderAmpm ? 12 : 24) : 59;
    const placeholder = input.placeholder || (isHour ? "HH" : "MM");
    const id = `${labelFor}_${index + 1}`;

    return (
      <div
        key={`${input.id}_${index}`}
        className={classnames(
          cssClass,
          `gfield_time_${part}`,
          "ginput_container ginput_container_time gform-grid-col"
        )}
      >
        <Input
          fieldData={{
            ...fieldData,
            type: "number",
          }}
          ref={focusPart === part ? ref : undefined}
          maxLength={2}
          step={1}
          min={0}
          max={max}
          placeholder={placeholder}
          id={id}
          labelFor={id}
          name={`${name}.${part}`}
          value={value?.[part] ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              [part]: event.target.value,
            })
          }
        />
        <label
          className={classnames(
            "gform-field-label gform-field-label--type-sub",
            `${part}_label`,
            !input.placeholder ? "screen-reader-text" : ""
          )}
          htmlFor={id}
          dangerouslySetInnerHTML={{
            __html: input.customLabel || placeholder,
          }}
        />
      </div>
    );
  };

  const renderAmpmInput = ({ value, onChange, focusPart, ref }) => {
    if (!shouldRenderAmpm) return null;
    const id = `${labelFor}_3`;

    return (
      <div
        key="ampm"
        className={classnames(
          cssClass,
          "gfield_time_ampm",
          "ginput_container ginput_container_time gform-grid-col"
        )}
      >
        <select
          name={`${name}.ampm`}
          id={id}
          value={value?.ampm ?? "am"}
          onChange={(event) =>
            onChange({
              ...value,
              ampm: event.target.value,
            })
          }
          ref={focusPart === "ampm" ? ref : undefined}
        >
          <option value="am">AM</option>
          <option value="pm">PM</option>
        </select>
        <label
          className="gform-field-label gform-field-label--type-sub am_pm_label screen-reader-text"
          htmlFor={id}
        >
          AM/PM
        </label>
      </div>
    );
  };

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={labelFor}
      wrapClassName={wrapClassName}
      wrapId={wrapId}
    >
      <Controller
        name={name}
        control={control}
        rules={{ validate: validateTime }}
        render={({ field }) => {
          const evaluation = evaluateTimeValue(field.value);
          const value = evaluation.normalizedValue || {};
          const focusPart = evaluation.invalidPart || partOrder[0];

          return (
            <div className="ginput_container ginput_complex gform-grid-row">
              {timeParts.map(({ input, part, index }) =>
                part === "ampm"
                  ? renderAmpmInput({
                      value,
                      onChange: field.onChange,
                      focusPart,
                      ref: field.ref,
                    })
                  : renderNumericInput({
                      input,
                      part,
                      index,
                      value,
                      onChange: field.onChange,
                      focusPart,
                      ref: field.ref,
                    })
              )}
            </div>
          );
        }}
      />
    </InputWrapper>
  );
};

TimeField.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    inputs: PropTypes.array,
    timeFormat: PropTypes.string,
    isRequired: PropTypes.bool,
    errorMessage: PropTypes.string,
  }),
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapClassName: PropTypes.string,
  wrapId: PropTypes.string,
};

export default TimeField;
