import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { useSettings } from "../../providers/SettingsContext";
import { getColumns, getEmptyRow, normalizeRows, hasRowValue } from "./helpers";
import useRowKeys from "./useRowKeys";
import ListRow from "./ListRow";

const List = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const {
    choices,
    errorMessage,
    hasColumns,
    isRequired,
    label,
    maxRows,
  } = fieldData;
  const { gfId } = wrapProps;
  const columns = getColumns({ choices, hasColumns, label });
  const hasMultipleColumns = hasColumns && columns.length > 1;
  const areButtonsRendered = maxRows !== 1;
  const { strings } = useSettings();

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const value = useWatch({ control, name });
  const rowCount = Array.isArray(value) && value.length > 0 ? value.length : 1;
  const { rowIds, insertRowKey, removeRowKey } = useRowKeys(rowCount);

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={labelFor}
      ginputClassName={
        hasColumns ? "ginput_container_list--columns" : undefined
      }
      {...wrapProps}
    >
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref } }) => {
          const rows = normalizeRows(value, columns);
          const hasMaxRows = Number.isInteger(maxRows) && maxRows > 0;
          const canAddRows = !hasMaxRows || rows.length < maxRows;
          const canDeleteRows = rows.length > 1;

          const updateCell = (rowIndex, columnKey, cellValue) => {
            onChange(
              rows.map((row, index) =>
                index === rowIndex ? { ...row, [columnKey]: cellValue } : row
              )
            );
          };

          const addRow = (rowIndex) => {
            if (!canAddRows) return;

            const nextRows = [...rows];
            nextRows.splice(rowIndex + 1, 0, getEmptyRow(columns));
            insertRowKey(rowIndex);
            onChange(nextRows);
          };

          const deleteRow = (rowIndex) => {
            if (!canDeleteRows) return;

            removeRowKey(rowIndex);
            onChange(rows.filter((_, index) => index !== rowIndex));
          };

          return (
            <div className="gfield_list gfield_list_container">
              {hasMultipleColumns && (
                <div className="gfield_list_header gform-grid-row">
                  {columns.map((column) => (
                    <div
                      className="gform-field-label gfield_header_item gform-grid-col"
                      key={column.key}
                    >
                      {column.label}
                    </div>
                  ))}
                  {areButtonsRendered && (
                    <div className="gfield_header_item gfield_header_item--icons gform-grid-col">
                      &nbsp;
                    </div>
                  )}
                </div>
              )}
              <div className="gfield_list_groups">
                {rows.map((row, rowIndex) => (
                  <ListRow
                    key={rowIds[rowIndex]}
                    row={row}
                    rowIndex={rowIndex}
                    columns={columns}
                    fieldData={fieldData}
                    gfId={gfId}
                    errors={errors}
                    hasMultipleColumns={hasMultipleColumns}
                    areButtonsRendered={areButtonsRendered}
                    canAddRows={canAddRows}
                    canDeleteRows={canDeleteRows}
                    inputRef={ref}
                    updateCell={updateCell}
                    addRow={addRow}
                    deleteRow={deleteRow}
                  />
                ))}
              </div>
            </div>
          );
        }}
        rules={{
          validate: (value) => {
            if (!isRequired) return true;

            const rows = normalizeRows(value, columns);

            if (rows.some(hasRowValue)) return true;

            return errorMessage || strings.errors.required;
          },
        }}
      />
    </InputWrapper>
  );
};

export default List;

List.propTypes = {
  fieldData: PropTypes.shape({
    addIconUrl: PropTypes.string,
    choices: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    deleteIconUrl: PropTypes.string,
    errorMessage: PropTypes.string,
    hasColumns: PropTypes.bool,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    maxRows: PropTypes.number,
  }),
  labelFor: PropTypes.string,
  name: PropTypes.string,
  gfId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapId: PropTypes.string,
  wrapClassName: PropTypes.string,
};
