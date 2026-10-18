import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Input } from "../General";

const ListIcon = ({ url, text }) => {
  if (!url) return text;

  return <img width={14} height={14} src={url} alt={text} />;
};

const ListRow = ({
  row,
  rowIndex,
  columns,
  fieldData,
  gfId,
  errors,
  hasMultipleColumns,
  areButtonsRendered,
  canAddRows,
  canDeleteRows,
  inputRef,
  updateCell,
  addRow,
  deleteRow,
}) => {
  const rowNumber = rowIndex + 1;
  const { addIconUrl, deleteIconUrl, isRequired } = fieldData;

  return (
    <div
      className={classnames(
        "gfield_list_group gform-grid-row",
        `gfield_list_row_${rowIndex % 2 === 0 ? "odd" : "even"}`
      )}
    >
      {columns.map((column, columnIndex) => {
        const ariaLabel = `${column.label}, Row ${rowNumber}`;

        return (
          <div
            className={classnames(
              "gfield_list_group_item gfield_list_cell gform-grid-col",
              `gfield_list_${gfId}_cell${columnIndex + 1}`
            )}
            data-label={hasMultipleColumns ? column.label : undefined}
            key={column.key}
          >
            <Input
              aria-required={isRequired}
              aria-label={ariaLabel}
              data-aria-label-template={`${column.label}, Row {0}`}
              fieldData={{ ...fieldData, type: "text" }}
              errors={errors}
              name={`input_${gfId}`}
              onChange={(event) =>
                updateCell(rowIndex, column.key, event.target.value)
              }
              ref={rowIndex === 0 && columnIndex === 0 ? inputRef : undefined}
              value={row[column.key] ?? ""}
            />
          </div>
        );
      })}
      {areButtonsRendered && (
        <div className="gfield_list_icons gform-grid-col">
          <button
            aria-label="Add another row"
            className={classnames(
              "add_list_item",
              !canAddRows && "gfield_icon_disabled"
            )}
            disabled={!canAddRows}
            onClick={() => addRow(rowIndex)}
            type="button"
          >
            <ListIcon url={addIconUrl} text="Add" />
          </button>
          <button
            aria-label={`Remove row ${rowNumber}`}
            className="delete_list_item"
            data-aria-label-template="Remove row {0}"
            disabled={!canDeleteRows}
            onClick={() => deleteRow(rowIndex)}
            style={{
              visibility: canDeleteRows ? "visible" : "hidden",
            }}
            type="button"
          >
            <ListIcon url={deleteIconUrl} text="Remove" />
          </button>
        </div>
      )}
    </div>
  );
};

ListIcon.propTypes = {
  text: PropTypes.string,
  url: PropTypes.string,
};

ListRow.propTypes = {
  row: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  fieldData: PropTypes.shape({
    addIconUrl: PropTypes.string,
    deleteIconUrl: PropTypes.string,
    isRequired: PropTypes.bool,
  }).isRequired,
  gfId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errors: PropTypes.object,
  hasMultipleColumns: PropTypes.bool,
  areButtonsRendered: PropTypes.bool,
  canAddRows: PropTypes.bool,
  canDeleteRows: PropTypes.bool,
  inputRef: PropTypes.func,
  updateCell: PropTypes.func.isRequired,
  addRow: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired,
};

export default ListRow;
