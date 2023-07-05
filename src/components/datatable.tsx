"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EditableCell from "./editable-cell";

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

export default function DataTable(prop: {
  columns: { label: string; data_type: string; isEditable?: boolean }[];
  data: Record<string, any>[];
  links?: {
    column_name: string;
    matching_key: string;
    links: { label: string; href: string }[];
  };
}) {
  const { columns, links } = prop;
  let { data } = prop;
  const [resetKey, setResetKey] = useState(0);
  const [saveKey, setSaveKey] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [localChanges, setLocalChanges] = useState<any>({});

  function handleEdit(id: string, column: string, value: any) {
    setLocalChanges((prevChanges: any) => {
      return {
        ...prevChanges,
        [id]: {
          ...(prevChanges[id] || {}),
          id: id,
          [column]: value,
        },
      };
    });
    setUnsavedChanges(true);
  }

  function handleSave() {
    //Todo: Save changes to db
    console.log("Saving changes to DB...", localChanges);
    data = data.map((row) => {
      if (localChanges[row.id]) {
        return { ...row, ...localChanges[row.id] };
      }
      return row;
    });
    setUnsavedChanges(false);
    setSaveKey(saveKey + 1);
  }

  function handleCancel() {
    setUnsavedChanges(false);
    setResetKey(resetKey + 1);
  }

  useEffect(() => {}, [data]);

  return (
    <div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.label}
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
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            {column.isEditable ? (
                              <EditableCell
                                resetKey={resetKey}
                                saveKey={saveKey}
                                value={row[column.label]}
                                onEdit={(newValue) =>
                                  handleEdit(row.id, column.label, newValue)
                                }
                              />
                            ) : (
                              <div className="text-sm text-gray-900">
                                {links && column.label === links.column_name ? (
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
                                      return <p>{row[column.label]}</p>;
                                    }
                                  })()
                                ) : (
                                  <p>{row[column.label]}</p>
                                )}
                              </div>
                            )}
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
