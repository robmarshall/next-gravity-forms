import React, { useRef, Suspense } from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import classNames from "classnames";
import InputWrapper from "../InputWrapper";
import Input from "../General/Input";
import { useSettings } from "../../providers/SettingsContext";
import FilePreview from "./FilePreview";
import RulesMessages from "./RulesMessages";
import {
  getRulesMessages,
  validateMaxSizeRule,
  cleanAllowedExtensions,
  validateExtRule,
} from "./helpers";

const LazyMultiFileupload = React.lazy(() => import("./Multifileupload"));

const FileUpload = ({ presetValue, fieldData, name, ...wrapProps }) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { strings, databaseId } = useSettings();
  const fileInputRef = useRef();

  const {
    isRequired,
    maxFileSize,
    allowedExtensions: dirtyExtensions,
    maxFiles,
    errorMessage,
    canAcceptMultipleFiles,
    id,
    defaultValue, // TOOD does file upload have a default value??
  } = fieldData;

  const allowedExtensions = cleanAllowedExtensions(dirtyExtensions);
  const rulesMessages = getRulesMessages(
    { allowedExtensions, maxFileSize, maxFiles },
    strings
  );
  const selectedValue = watch(name);
  const isGFValidationError = errors?.[name]?.type === "gf_validation";

  const rulesMessagesComponent = () => {
    return (
      rulesMessages && (
        <RulesMessages
          id={id}
          databaseId={databaseId}
          isGFValidationError={isGFValidationError}
        >
          {rulesMessages}
        </RulesMessages>
      )
    );
  };

  const removeSelectedFile = () => {
    setValue(name, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <InputWrapper
      errors={errors?.[name]}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      {canAcceptMultipleFiles ? ( // multi files upload
        <Suspense>
          <Controller
            name={name}
            control={control}
            render={({ field: { onChange } }) => (
              <LazyMultiFileupload
                name={name}
                databaseId={databaseId}
                id={id}
                maxFiles={maxFiles}
                maxFileSize={maxFileSize}
                accept={allowedExtensions}
                onChange={onChange}
                strings={strings}
                rulesMessages={rulesMessagesComponent()}
                setValue={setValue}
              />
            )}
            rules={{
              required: isRequired && (errorMessage || strings.errors.required),
            }}
          />
        </Suspense>
      ) : (
        // single file upload
        <>
          {isGFValidationError && selectedValue?.length > 0 && (
            <FilePreview
              databaseId={databaseId}
              id={id}
              files={selectedValue}
              strings={strings}
              removeFile={removeSelectedFile}
            />
          )}
          <Controller
            name={name}
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                className={classNames(isGFValidationError && "gform_hidden")}
                name={name}
                errors={errors}
                fieldData={fieldData}
                type="file"
                maxLength={undefined}
                aria-describedby={`gfield_upload_rules_${databaseId}_${wrapProps.gfId}`}
                accept={
                  allowedExtensions.length > 0
                    ? allowedExtensions.map((ext) => `.${ext}`).join(",")
                    : undefined
                }
                onChange={(e) =>
                  e.target.files && onChange([e.target.files[0]])
                }
                ref={fileInputRef}
              />
            )}
            rules={{
              required: isRequired && (errorMessage || strings.errors.required),
              validate: {
                maxSize: (value) =>
                  validateMaxSizeRule(value, maxFileSize, strings),
                allowedTypes: (value) =>
                  validateExtRule(value, allowedExtensions, strings),
              },
            }}
          />
          {rulesMessagesComponent()}
        </>
      )}
    </InputWrapper>
  );
};

FileUpload.propTypes = {
  presetValue: PropTypes.string,
  fieldData: PropTypes.shape({
    isRequired: PropTypes.bool,
    maxFileSize: PropTypes.number,
    errorMessage: PropTypes.string,
    allowedExtensions: PropTypes.arrayOf(PropTypes.string),
    maxFiles: PropTypes.number,
    canAcceptMultipleFiles: PropTypes.bool,
    id: PropTypes.number,
    defaultValue: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  wrapProps: PropTypes.object,
};

export default FileUpload;
