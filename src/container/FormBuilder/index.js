import React, { useState } from "react";
import classnames from "classnames";
import { useSettings } from "../../providers/SettingsContext";
import FieldBuilder from "../FieldBuilder";
import PageNav from "./PageNav";
import SubmitButton from "../../components/Submit";
import { valueToLowerCase, groupFields } from "../../utils/helpers";
import { ConditionalWrapper } from "../../components/General";

const FormBuilder = ({ nodes, preOnSubmit, presetValues, trigger }) => {
  const { databaseId, settings, loading, form } = useSettings();
  const [page, setPage] = useState(1);
  const { subLabelPlacement, descriptionPlacement, labelPlacement } = form;

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
              trigger={trigger}
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
            presetValues={presetValues}
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

export default FormBuilder;
