import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import classNames from "classnames";
import InputWrapper from "../InputWrapper";
import Input from "../General/Input";
import { useSettings } from "../../providers/SettingsContext";
import FilePreview from "./FilePreview";
import {
  getRulesMessages,
  getAllowedTypesList,
  validateMaxFileSize,
  validateType,
  cleanAllowedExtensions,
} from "./helpers";

const FileUpload = ({ defaultValue, fieldData, name, ...wrapProps }) => {
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
  } = fieldData;
  const allowedExtensions = cleanAllowedExtensions(dirtyExtensions);
  const rulesMessages = getRulesMessages(
    { allowedExtensions, maxFileSize, maxFiles },
    strings
  );
  const selectedValue = watch(name);
  const isGFValidationError = errors?.[name]?.type === "gf_validation";

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
      {isGFValidationError && selectedValue?.length > 0 && (
        <div
          id={`gform_preview_${databaseId}_${wrapProps.gfId}`}
          className="ginput_preview_list"
        >
          {selectedValue.map((file, i) => (
            <FilePreview
              key={`${file.name}-${i}`}
              strings={strings}
              name={file.name}
              removeFile={removeSelectedFile}
            />
          ))}
        </div>
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
            onChange={(e) => e.target.files && onChange([e.target.files[0]])}
            ref={fileInputRef}
          />
        )}
        rules={{
          required: isRequired && (errorMessage || strings.errors.required),
          validate: {
            maxSize: (files) =>
              !maxFileSize > 0 ||
              validateMaxFileSize(
                files,
                maxFileSize,
                strings.errors.fileupload.exceedsSizeLimit,
                maxFileSize
              ),
            allowedTypes: (files) =>
              !allowedExtensions?.length > 0 ||
              validateType(
                files,
                allowedExtensions,
                strings.errors.fileupload.typeNotAllowed,
                getAllowedTypesList(allowedExtensions)
              ),
          },
        }}
      />
      {rulesMessages && (
        <span
          className={classNames(
            isGFValidationError && "gform_hidden",
            "gfield_description gform_fileupload_rules"
          )}
          id={`gfield_upload_rules_${databaseId}_${wrapProps.gfId}`}
        >
          {rulesMessages}
        </span>
      )}
    </InputWrapper>
  );
};

FileUpload.propTypes = {
  defaultValue: PropTypes.string,
  fieldData: PropTypes.shape({
    isRequired: PropTypes.bool,
    maxFileSize: PropTypes.number,
    errorMessage: PropTypes.string,
    allowedExtensions: PropTypes.arrayOf(PropTypes.string),
    maxFiles: PropTypes.number,
  }),
  name: PropTypes.string.isRequired,
  wrapProps: PropTypes.object,
};

export default FileUpload;
