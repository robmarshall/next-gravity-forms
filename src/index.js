// https://github.com/codifytools/react-npm-package-boilerplate/blob/master/package.json

import PropTypes from "prop-types";
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormContent from "./components/FormContent";
import { handleGravityFormsValidationErrors } from "./utils/manageErrors";
import scrollToElement from "./utils/scrollToElement";
import getDefaultValues from "./utils/getDefaultVlaues";
import { submissionHasOneFieldEntry } from "./utils/manageFormData";
import formatPayload from "./utils/formatPayload";
import FormBuilder from "./container/FormBuilder";
import { submitGravityForm } from "./fetch";
import { SettingsProvider } from "./providers/SettingsContext";
import classNames from "classnames";
import useConfirmation from "./hooks/useConfirmation";

/**
 * Component to take Gravity Form graphQL data and turn into
 * a fully functional form.
 * @param {mixed} data Form dataset from graphQL
 */
const GravityFormForm = forwardRef(
  (
    {
      data,
      presetValues = null,
      successCallback = () => {},
      errorCallback = () => {},
      navigate,
      helperText = {},
      helperFieldsSettings = {},
      customFormFields = {},
    },
    ref
  ) => {
    const preOnSubmit = useRef();
    const wrapperRef = useRef(null);

    // Split out form data.
    const form = data?.gfForm;

    // Deconstruct global settings (if provided).
    const settings = data?.gfSettings || {};

    const {
      confirmations,
      databaseId,
      descriptionPlacement,
      formFields,
      labelPlacement,
      subLabelPlacement,
      hasHoneypot,
    } = form;

    // Pull in form functions
    const methods = useForm({
      // Predefine default values (needed for conditional fields to ensure they render correctly on the initial load).
      // This is needed because `react-hook-form` doesn't automatically detect `defaultValue` attributes in fields,
      // and the form state starts empty. By setting these defaults upfront, we enable `react-hook-form` to
      // immediately recognize and apply them, ensuring conditional fields behave as expected from the start.
      defaultValues: getDefaultValues(formFields?.nodes, presetValues, {
        helperFieldsSettings,
        settings,
      }),
    });
    const { handleSubmit, setError, reset, getValues, setValue, watch } =
      methods;

    // expose methods to parent
    useImperativeHandle(ref, () => ({
      setError,
      reset,
      getValues,
      setValue,
      watch,
    }));

    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);

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

    const setFormError = (code) => {
      setGeneralError(code);

      // scroll to error message
      if (code && wrapperRef.current) {
        scrollToElement(wrapperRef.current, 60);
      }
    };

    const onSubmitCallback = async () => {
      // Make sure we are not already waiting for a response
      if (!loading) {
        setLoading(true);
        // Clean error
        await preOnSubmit?.current?.recaptcha();
        const values = getValues();

        // Check that at least one field has been filled in
        if (submissionHasOneFieldEntry(values)) {
          setFormError("");
          const formRes = formatPayload({
            serverData: formFieldNodes,
            clientData: values,
          });

          try {
            const submitRes = await submitGravityForm({
              id: databaseId,
              fieldValues: formRes,
            });

            if (
              !submitRes?.errors?.length &&
              !submitRes?.submitGfForm?.errors
            ) {
              handleConfirmation(values);
              setLoading(false);
              successCallback({
                data: formRes,
                reset,
              });
            } else {
              setLoading(false);
              setFormError("formHasError");
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
            setFormError("unknownError");
            setLoading(false);
            errorCallback({ data: formRes, error, reset });
          }
        } else {
          setLoading(false);
          setFormError("leastOneField");
        }
      }
    };

    // handle confirmations
    const { confirmation, handleConfirmation } = useConfirmation({
      confirmations,
      navigate,
      formFieldNodes,
    });

    return (
      <div
        className={classNames(
          "gform_wrapper",
          generalError && "gform_validation_error"
        )}
        id={`gform_wrapper_${databaseId}`}
        ref={wrapperRef}
      >
        <SettingsProvider
          helperText={helperText}
          helperFieldsSettings={helperFieldsSettings}
          settings={settings}
          form={form}
          loading={loading}
          customFormFields={customFormFields}
        >
          <FormContent
            generalError={generalError}
            confirmation={confirmation}
            form={form}
          />

          {!confirmation && formFields && (
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
                <FormBuilder nodes={formFieldNodes} preOnSubmit={preOnSubmit} />
              </form>
            </FormProvider>
          )}
        </SettingsProvider>
      </div>
    );
  }
);

GravityFormForm.displayName = "GravityFormForm";

GravityFormForm.propTypes = {
  errorCallback: PropTypes.func,
  data: PropTypes.object.isRequired,
  successCallback: PropTypes.func,
  presetValues: PropTypes.shape({}),
  helperText: PropTypes.shape({}),
  helperFieldsSettings: PropTypes.object,
  navigate: PropTypes.func,
  customFormFields: PropTypes.object,
};

export default GravityFormForm;
