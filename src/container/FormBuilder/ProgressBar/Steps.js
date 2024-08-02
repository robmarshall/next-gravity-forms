import classNames from "classnames";
import { array, number } from "prop-types";
import React from "react";

const Steps = ({ databaseId, currentPage, totalPages, pageNames = [] }) => {
  return (
    <div id={`gf_page_steps_${databaseId}`} className="gf_page_steps">
      {Array.from({ length: totalPages }, (_, index) => (
        <div
          className={classNames(
            "gf_step",
            index === 0 && "gf_step_first",
            index + 1 === totalPages && "gf_step_last",
            index === currentPage && "gf_step_next",
            currentPage - 1 === index + 1 && "gf_step_previous",
            index + 1 > currentPage && "gf_step_pending",
            index + 1 < currentPage && "gf_step_completed",
            index + 1 === currentPage && "gf_step_active"
          )}
          id={`gf_step_${databaseId}_${index + 1}`}
          key={index}
        >
          <span className="gf_step_number">{index + 1}</span>
          {pageNames?.[index] && (
            <span className="gf_step_label">{pageNames[index]}</span>
          )}
        </div>
      ))}
    </div>
  );
};

Steps.propTypes = {
  databaseId: number.isRequired,
  currentPage: number.isRequired,
  totalPages: number.isRequired,
  pageNames: array,
};

export default Steps;
