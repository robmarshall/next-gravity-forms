// https://github.com/codifytools/react-npm-package-boilerplate/blob/master/package.json

import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormGeneralError from "./components/FormGeneralError";
import FieldBuilder from "./container/FieldBuilder";
import { handleGravityFormsValidationErrors } from "./utils/manageErrors";
import getDefaultValues from "./utils/getDefaultVlaues";
import { submissionHasOneFieldEntry } from "./utils/manageFormData";
import formatPayload from "./utils/formatPayload";
import { valueToLowerCase, isInternalLink } from "./utils/helpers";
import { submitGravityForm } from "./fetch";
import { SettingsProvider } from "./providers/SettingsContext";
import SubmitButton from "./components/SubmitButton";

/**
 * Component to take Gravity Form graphQL data and turn into
 * a fully functional form.
 * @param {mixed} data Form dataset from graphQL
 */
const GravityFormForm = ({
  data,
  presetValues = null,
  successCallback = () => {},
  errorCallback = () => {},
  navigate,
  helperText = {},
  helperFieldsSettings = {},
}) => {
  const preOnSubmit = useRef();

  // Split out form data.
  const form = data?.gfForm;

  // Deconstruct global settings (if provided).
  const settings = data?.gfSettings || {};

  const {
    submitButton,
    confirmations,
    databaseId,
    descriptionPlacement,
    formFields,
    labelPlacement,
    subLabelPlacement,
    hasHoneypot,
  } = form;

  const redirect = navigate
    ? (url) => {
        navigate(url);
      }
    : (url) => {
        return (window.location.href = url);
      };

  // Pull in form functions
  const methods = useForm({
    // Predefine default values (needed for conditional fields to ensure they render correctly on the initial load).
    // This is needed because `react-hook-form` doesn't automatically detect `defaultValue` attributes in fields,
    // and the form state starts empty. By setting these defaults upfront, we enable `react-hook-form` to
    // immediately recognize and apply them, ensuring conditional fields behave as expected from the start.
    defaultValues: getDefaultValues(formFields?.nodes, presetValues),
  });
  const { handleSubmit, setError, reset, getValues } = methods;

  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // add honeypot fake field if enabled to list of fields
  const formFieldNodes = formFields?.nodes?.length > 0 && [
    ...formFields.nodes,
    hasHoneypot && {
      id: formFields.nodes[formFields.nodes.length - 1].id + 1,
      type: "HONEYPOT",
      descriptionPlacement,
      labelPlacement,
      subLabelPlacement,
    },
  ];

  const onSubmitCallback = async () => {
    // Make sure we are not already waiting for a response
    if (!loading) {
      setLoading(true);
      // Clean error
      await preOnSubmit?.current?.recaptcha();
      const values = getValues();

      // Check that at least one field has been filled in
      if (submissionHasOneFieldEntry(values)) {
        setGeneralError("");
        const formRes = formatPayload({
          serverData: formFieldNodes,
          clientData: values,
        });

        try {
          const submitRes = await submitGravityForm({
            id: databaseId,
            fieldValues: formRes,
          });

          if (!submitRes?.errors?.length && !submitRes?.submitGfForm?.errors) {
            setSuccess(true);
            setLoading(false);
            successCallback({
              data: formRes,
              reset,
            });
          } else {
            setLoading(false);
            handleGravityFormsValidationErrors(
              submitRes?.submitGfForm?.errors,
              setError
            );
            errorCallback({
              data: formRes,
              error: handleGravityFormsValidationErrors(
                submitRes?.submitGfForm?.errors
              ),
              reset,
            });
          }
        } catch (error) {
          console.log(error);
          setGeneralError("unknownError");
          setLoading(false);
          errorCallback({ data: formRes, error, reset });
        }
      } else {
        setLoading(false);
        setGeneralError("leastOneField");
      }
    }
  };

  if (success) {
    const confirmation = confirmations?.find((el) => {
      // First check if there is a custom confirmation
      // that is not the default.
      if (el.isActive && !el.isDefault) {
        return true;
      }

      // If not, revert back to the default one.
      if (el.isDefault) {
        return true;
      }
    });

    if (confirmation.type === "PAGE") {
      // TODO add fields values into link, .i.e. phone={Phone:1}&email={Email:2}
      redirect(confirmation?.page?.node?.link);
    }

    if (confirmation.type === "REDIRECT") {
      if (!confirmation?.url) return;

      // TODO add fields values into link, .i.e. phone={Phone:1}&email={Email:2}
      if (isInternalLink(confirmation.url)) {
        redirect(confirmation.url);
      }

      window.location.href = confirmation.url;
    }

    if (confirmation.type === "MESSAGE") {
      return (
        <div className="gform_confirmation_wrapper">
          <div
            className="gform_confirmation_message"
            /* eslint-disable react/no-danger */
            dangerouslySetInnerHTML={{ __html: confirmation?.message }}
          />
        </div>
      );
    }
  }

  return (
    <div className="gform_wrapper" id={`gform_wrapper_${databaseId}`}>
      <div className="gform_anchor" id={`gf_${databaseId}`} />

      {formFields && (
        <SettingsProvider
          helperText={helperText}
          databaseId={databaseId}
          helperFieldsSettings={helperFieldsSettings}
        >
          <FormProvider {...methods} formFields={formFields}>
            <form
              className={
                loading
                  ? `gravityform gravityform--loading gravityform--id-${databaseId}`
                  : `gravityform gravityform--id-${databaseId}`
              }
              id={`gform_${databaseId}`}
              key={`gform_-${databaseId}`}
              onSubmit={handleSubmit(onSubmitCallback)}
              noValidate // needed to skip the built in form validation, as we use custom one
            >
              {generalError && <FormGeneralError errorCode={generalError} />}
              <div className="gform-body gform_body">
                <div
                  className={classnames(
                    "gform_fields",
                    {
                      [`form_sublabel_${valueToLowerCase(subLabelPlacement)}`]:
                        valueToLowerCase(subLabelPlacement),
                    },
                    `description_${valueToLowerCase(descriptionPlacement)}`,
                    `${valueToLowerCase(labelPlacement)}_label`
                  )}
                  id={`gform_fields_${databaseId}`}
                >
                  <FieldBuilder
                    databaseId={databaseId}
                    formLoading={loading}
                    formFields={formFieldNodes}
                    labelPlacement={labelPlacement}
                    preOnSubmit={preOnSubmit}
                    settings={settings}
                    formLayoutProps={form}
                  />
                </div>
              </div>

              <div
                className={`gform_footer ${valueToLowerCase(labelPlacement)}`}
              >
                <SubmitButton
                  databaseId={databaseId}
                  loading={loading}
                  submitButton={submitButton}
                />
              </div>
            </form>
          </FormProvider>
        </SettingsProvider>
      )}
    </div>
  );
};

GravityFormForm.propTypes = {
  errorCallback: PropTypes.func,
  data: PropTypes.object.isRequired,
  successCallback: PropTypes.func,
  presetValues: PropTypes.shape({}),
  helperText: PropTypes.shape({}),
  helperFieldsSettings: PropTypes.object,
  navigate: PropTypes.func,
};

export default GravityFormForm;
