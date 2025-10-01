import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { getKeyByValue, valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import { Input, ConditionalWrapper, SubLabelWrapper } from "../General";
import { useSettings } from "../../providers/SettingsContext";
import StrengthIndicator from "./StrengthIndicator";
import VisibilityToggler from "./VisibilityToggler";

const Password = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const {
    isRequired,
    placeholder,
    inputs,
    subLabelPlacement,
    size,
    errorMessage,
    hasPasswordStrengthIndicator,
    hasPasswordVisibilityToggle,
    minPasswordStrength,
  } = fieldData;
  const [passwordField, confirmPasswordField] = inputs || [];
  const { strings } = useSettings();
  const [zxcvbn, setZxcvbn] = useState(null);
  const hasConfirmationField = !confirmPasswordField.isHidden;

  const {
    control,
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const strengthLevels = {
    bad: 2,
    good: 3,
    strong: 4,
  };

  useEffect(() => {
    if (hasPasswordStrengthIndicator && !zxcvbn) {
      import("zxcvbn").then((module) => {
        setZxcvbn(() => module.default); // Set the imported module
      });
    }
  }, [hasPasswordStrengthIndicator, zxcvbn]);

  const getScore = (value) => {
    const result = zxcvbn && zxcvbn(value);
    const score = result?.score;
    const indicator = getKeyByValue(strengthLevels, score) || "short";
    return indicator;
  };

  return (
    <InputWrapper
      errors={errors?.[name] || errors?.[`${name}_2`] || {}}
      inputData={fieldData}
      labelFor={labelFor}
      {...wrapProps}
    >
      <Controller
        name={name}
        control={control}
        rules={{
          required: isRequired && (errorMessage || strings.errors.required),
          ...(hasPasswordStrengthIndicator &&
            isRequired && {
              validate: (value) => {
                const result = zxcvbn(value || "");
                const requiredScore =
                  strengthLevels[valueToLowerCase(minPasswordStrength)] || 0;

                return (
                  result.score >= requiredScore || strings.password.minStrength
                );
              },
            }),
        }}
        render={({ field: { onChange, value, ref } }) => {
          const [eyeVisibility, setEyeVisibility] = useState({
            password: false,
            confirmationPassword: false,
          });
          return (
            <>
              <ConditionalWrapper // render only when there is confirmation field added
                condition={!!hasConfirmationField}
                wrapper={(children) => (
                  <SubLabelWrapper
                    subLabelPlacement={subLabelPlacement}
                    id={1}
                    className="ginput_left"
                    {...passwordField}
                    name={name}
                    labelFor={labelFor}
                  >
                    {children}
                  </SubLabelWrapper>
                )}
              >
                <Input
                  name={name}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  errors={errors}
                  fieldData={{
                    ...fieldData,
                    type: eyeVisibility.password ? "text" : "password",
                  }}
                  className={valueToLowerCase(size)}
                  labelFor={labelFor}
                  placeholder={passwordField?.placeholder || placeholder}
                  ref={ref}
                />
                {hasPasswordVisibilityToggle && (
                  <VisibilityToggler
                    strings={strings}
                    active={eyeVisibility.password}
                    onClick={() => {
                      setEyeVisibility({
                        ...eyeVisibility,
                        password: !eyeVisibility.password,
                      });
                    }}
                  />
                )}
              </ConditionalWrapper>

              {hasConfirmationField && (
                <SubLabelWrapper
                  subLabelPlacement={subLabelPlacement}
                  id={2}
                  className="ginput_right"
                  {...confirmPasswordField}
                  name={`${name}_2`}
                  labelFor={`${labelFor}_2`}
                >
                  <Input
                    name={`${name}_2`}
                    errors={errors}
                    fieldData={{
                      ...fieldData,
                      type: eyeVisibility.confirmationPassword
                        ? "text"
                        : "password",
                    }}
                    labelFor={`${labelFor}_2`}
                    {...register(`${name}_2`, {
                      validate: (val) => {
                        const pass1 = watch(name);
                        return (
                          !pass1 ||
                          pass1 === val ||
                          strings.errors.passwordsDontmatch
                        );
                      },
                    })}
                    placeholder={
                      confirmPasswordField?.placeholder || placeholder
                    }
                  />
                  {hasPasswordVisibilityToggle && (
                    <VisibilityToggler
                      strings={strings}
                      active={eyeVisibility.confirmationPassword}
                      onClick={() => {
                        setEyeVisibility({
                          ...eyeVisibility,
                          confirmationPassword:
                            !eyeVisibility.confirmationPassword,
                        });
                      }}
                    />
                  )}
                </SubLabelWrapper>
              )}

              {hasPasswordStrengthIndicator && zxcvbn && (
                <StrengthIndicator
                  score={value ? getScore(value) : "blank"}
                  labelFor={labelFor}
                  strings={strings}
                />
              )}
            </>
          );
        }}
      />
    </InputWrapper>
  );
};

export default Password;

Password.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    subLabelPlacement: PropTypes.string,
    inputs: PropTypes.array,
    errorMessage: PropTypes.string,
    hasPasswordStrengthIndicator: PropTypes.bool,
    hasPasswordVisibilityToggle: PropTypes.bool,
    minPasswordStrength: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
