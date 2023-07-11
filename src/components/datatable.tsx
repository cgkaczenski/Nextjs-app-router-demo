"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EditableCell from "./editable-cell";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const formatValue = (value: any, dataType: string) => {
  if (dataType === "boolean") {
    return value.toString();
  }
  if (dataType === "datetime") {
    return formatDate(value);
  }
  return value;
};

type ObjectType = { [key: string]: any };

const sortObjectsByKey = (
  array: ObjectType[],
  key: string,
  inverse: boolean = false
) => {
  return array.sort((a, b) => {
    const aValue = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
    const bValue = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

    if (aValue < bValue) {
      return inverse ? 1 : -1;
    } else if (aValue > bValue) {
      return inverse ? -1 : 1;
    }
    return 0;
  });
};

export default function DataTable(prop: {
  columns: {
    label: string;
    data_type: string;
    input_type: string;
    isEditable?: boolean;
  }[];
  data: Record<string, any>[];
  links?: {
    column_name: string;
    matching_key: string;
    links: { label: string; href: string }[];
  };
  onSave?: (changes: Record<string, any>) => Promise<boolean | undefined>;
}) {
  const { columns, links, onSave } = prop;
  const [data, setData] = useState<Record<string, any>[]>(prop.data);
  const [resetKey, setResetKey] = useState(0);
  const [saveKey, setSaveKey] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [localChanges, setLocalChanges] = useState<any>({});
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortedInverse, setSortedInverse] = useState(false);

  function handleEdit(id: string, column: string, value: any) {
    const originalRow = data.find((row) => row.id === id);
    setLocalChanges((prevChanges: any) => {
      const newChanges = { ...prevChanges };
      if (originalRow && originalRow[column] !== value) {
        newChanges[id] = {
          ...(newChanges[id] || {}),
          id: id,
          [column]: value,
        };
      } else {
        if (newChanges[id]) {
          delete newChanges[id][column];
          // If there is only one key in the newChanges, it is just the id and can be deleted
          if (Object.keys(newChanges[id]).length === 1) {
            delete newChanges[id];
          }
        }
      }
      setUnsavedChanges(Object.keys(newChanges).length !== 0);
      return newChanges;
    });
  }

  async function handleSave() {
    if (typeof onSave === "function") {
      const isSuccessful = await onSave(localChanges);

      if (isSuccessful) {
        const updateData = data.map((row) => {
          if (localChanges[row.id]) {
            return { ...row, ...localChanges[row.id] };
          }
          return row;
        });
        setData(updateData);
        setUnsavedChanges(false);
        setSaveKey(saveKey + 1);
      }
    }
  }

  function handleCancel() {
    setLocalChanges({});
    setUnsavedChanges(false);
    setResetKey(resetKey + 1);
  }

  function handleSort(column: string) {
    if (sortedColumn === column) {
      setSortedInverse(!sortedInverse);
    } else {
      setSortedColumn(column);
    }
    const sortedData = sortObjectsByKey([...data], column, sortedInverse);
    setData(sortedData);
  }

  useEffect(() => {}, [data]);

  return (
    <div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50 ">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          {column.label}
                          <a onClick={() => handleSort(column.label)}>
                            <ArrowsUpDownIcon className="w-3 h-3 ml-1.5" />
                          </a>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap overflow-auto"
                          >
                            <div className="max-w-xs overflow-auto">
                              {column.isEditable ? (
                                <EditableCell
                                  resetKey={resetKey}
                                  saveKey={saveKey}
                                  value={row[column.label]}
                                  input_type={column.input_type}
                                  onEdit={(newValue) =>
                                    handleEdit(row.id, column.label, newValue)
                                  }
                                />
                              ) : (
                                <div className="text-sm text-gray-900">
                                  {links &&
                                  column.label === links.column_name ? (
                                    (() => {
                                      const linkObj = links.links.find(
                                        (link) =>
                                          link.label === row[links.matching_key]
                                      );
                                      if (linkObj) {
                                        return (
                                          <Link
                                            href={linkObj.href}
                                            className="text-blue-400"
                                            prefetch={false}
                                          >
                                            {row[column.label]}
                                          </Link>
                                        );
                                      } else {
                                        return (
                                          <p>
                                            {formatValue(
                                              row[column.label],
                                              column.data_type
                                            )}
                                          </p>
                                        );
                                      }
                                    })()
                                  ) : (
                                    <p>
                                      {formatValue(
                                        row[column.label],
                                        column.data_type
                                      )}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        There is no data in this table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {unsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 py-4 flex justify-center items-center space-x-4">
          <div className="text-red-500">Unsaved changes</div>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
