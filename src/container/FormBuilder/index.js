import React, { useState } from "react";
import { array, func } from "prop-types";
import classnames from "classnames";
import { useSettings } from "../../providers/SettingsContext";
import FieldBuilder from "../FieldBuilder";
import PageNav from "./PageNav";
import SubmitButton from "../../components/Submit";
import { valueToLowerCase, groupFields } from "../../utils/helpers";
import { ConditionalWrapper } from "../../components/General";
import ProgressBar from "./ProgressBar";

const FormBuilder = ({ nodes, preOnSubmit }) => {
  const { databaseId, settings, loading, form } = useSettings();
  const [page, setPage] = useState(1);
  const {
    subLabelPlacement,
    descriptionPlacement,
    labelPlacement,
    pagination,
  } = form;

  const { lastPageButton, type } = pagination || {};

  if (!nodes?.length) return null;

  const pages = groupFields(nodes);
  const hasPages = Object.keys(pages).length > 2;

  const renderPage = (pageNumber, fields) => {
    if (pageNumber === "default" || pageNumber != page) return null;

    return (
      <ConditionalWrapper
        key={`page-${databaseId}-${pageNumber}`}
        condition={hasPages}
        wrapper={(children) => (
          <div
            className={`gform_page`}
            id={`gform_page_${databaseId}_${pageNumber}`}
          >
            <div className="gform_page_fields">{children}</div>
            <PageNav
              currentPage={page}
              setPage={setPage}
              isLastPage={Object.keys(pages).length - 1 == pageNumber}
              labelPlacement={labelPlacement}
              databaseId={databaseId}
              loading={loading}
              nodes={nodes}
              lastPageButton={lastPageButton}
            />
          </div>
        )}
      >
        <div
          key={`gf-${pageNumber}`}
          className={classnames(
            "gform_fields",
            `form_sublabel_${valueToLowerCase(subLabelPlacement)}`,
            `description_${valueToLowerCase(descriptionPlacement)}`,
            `${valueToLowerCase(labelPlacement)}_label`
          )}
          id={`gform_fields_${databaseId}${
            pageNumber > 1 ? `_${pageNumber}` : ""
          }`}
        >
          <FieldBuilder
            databaseId={databaseId}
            formLoading={loading}
            formFields={fields}
            preOnSubmit={preOnSubmit}
            settings={settings}
            formLayoutProps={{
              labelPlacement,
              descriptionPlacement,
              subLabelPlacement,
            }}
          />
        </div>
      </ConditionalWrapper>
    );
  };

  return (
    <>
      {type && type !== "NONE" && (
        <ProgressBar
          currentPage={page}
          totalPages={Object.keys(pages).length - 1}
          databaseId={databaseId}
          {...pagination}
        />
      )}
      <div className="gform-body gform_body">
        {Object.entries(pages).map(([pageNumber, fields]) =>
          renderPage(pageNumber, fields)
        )}
      </div>
      {!hasPages && (
        <div className={`gform_footer ${valueToLowerCase(labelPlacement)}`}>
          <SubmitButton />
        </div>
      )}
    </>
  );
};

FormBuilder.propTypes = {
  nodes: array,
  preOnSubmit: func.isRequired,
  trigger: func.isRequired,
};

export default FormBuilder;
