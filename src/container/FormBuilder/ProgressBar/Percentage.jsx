import React from "react";
import { interpolateString, valueToLowerCase } from "../../../utils/helpers";
import { useSettings } from "../../../providers/SettingsContext";
import classNames from "classnames";
import { array, bool, number, string } from "prop-types";

const renderInterpolatedHtml = (template, values) => {
  const interpolatedString = interpolateString(template, values);

  // Split the interpolated string to insert HTML tags
  const parts = interpolatedString.split(/(\{\{step\}\}|\{\{total\}\})/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part === "{{step}}") {
          return (
            <span key={index} className="gf_step_current_page">
              {values.step}
            </span>
          );
        }
        if (part === "{{total}}") {
          return (
            <span key={index} className="gf_step_page_count">
              {values.total}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};

const Percentage = ({
  databaseId,
  currentPage,
  totalPages,
  pageNames = [],
  style = "",
  isCompleted = false,
  progressbarCompletionText = "",
}) => {
  const { strings } = useSettings();
  const progress = isCompleted
    ? 100
    : Math.floor((currentPage / totalPages) * 100);

  return (
    <div
      id={`gf_progressbar_wrapper_${databaseId}`}
      className="gf_progressbar_wrapper"
    >
      <p className="gf_progressbar_title">
        {isCompleted ? (
          <>{progressbarCompletionText ? progressbarCompletionText : ""}</>
        ) : (
          <>
            {" "}
            {renderInterpolatedHtml(strings.step, {
              step: currentPage,
              total: totalPages,
            })}
            {pageNames?.[currentPage - 1] && (
              <>{` - ${pageNames[currentPage - 1]}`}</>
            )}
          </>
        )}
      </p>
      <div
        className={classNames(
          "gf_progressbar",
          style && `gf_progressbar_${valueToLowerCase(style)}`
        )}
        aria-hidden="true"
      >
        <div
          className={classNames(
            "gf_progressbar_percentage",
            style && `percentbar_${valueToLowerCase(style)}`
          )}
          style={{ width: `${progress}%` }}
        >
          <span>{`${progress}%`}</span>
        </div>
      </div>
    </div>
  );
};

Percentage.propTypes = {
  databaseId: number,
  currentPage: number,
  totalPages: number,
  pageNames: array,
  style: string,
  isCompleted: bool,
  progressbarCompletionText: string,
};

export default Percentage;
