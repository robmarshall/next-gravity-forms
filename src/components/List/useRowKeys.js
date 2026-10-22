import { useState } from "react";

/**
 * Maintains rendering IDs separately from form values as rows are added or removed.
 *
 * @param {number} rowCount - Number of rows currently rendered by the list.
 * @returns {{ rowIds: number[], insertRowKey: function, removeRowKey: function }}
 * Row identities and handlers for keeping them aligned with row changes.
 */
const useRowKeys = (rowCount) => {
  const [rowKeys, setRowKeys] = useState(() => ({
    ids: Array.from({ length: rowCount }, (_, index) => index),
    nextId: rowCount,
  }));

  // Reconcile external value changes, such as resets, before rendering children.
  if (rowKeys.ids.length !== rowCount) {
    const ids = rowKeys.ids.slice(0, rowCount);
    let nextId = rowKeys.nextId;

    while (ids.length < rowCount) {
      ids.push(nextId++);
    }

    setRowKeys({ ids, nextId });
  }

  const insertRowKey = (rowIndex) => {
    setRowKeys(({ ids, nextId }) => ({
      ids: [
        ...ids.slice(0, rowIndex + 1),
        nextId,
        ...ids.slice(rowIndex + 1),
      ],
      nextId: nextId + 1,
    }));
  };

  const removeRowKey = (rowIndex) => {
    setRowKeys(({ ids, nextId }) => ({
      ids: ids.filter((_, index) => index !== rowIndex),
      nextId,
    }));
  };

  return { rowIds: rowKeys.ids, insertRowKey, removeRowKey };
};

export default useRowKeys;
