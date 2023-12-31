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
    let aValue = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
    let bValue = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

    // Handle empty strings and null values
    if (aValue === "" || aValue === null) {
      return inverse ? -1 : 1;
    }
    if (bValue === "" || bValue === null) {
      return inverse ? 1 : -1;
    }

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
  onFetch?: (
    pageSize: number,
    pageNumber: number
  ) => Promise<Record<string, any>[]>;
  total_count: number;
}) {
  const page_size = 100;
  const { columns, links, onSave, total_count } = prop;
  const [pageNumber, setPageNumber] = useState(1);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<Record<string, any>[]>(prop.data);
  const [recordCount, setRecordCount] = useState(data.length);
  const [resetKey, setResetKey] = useState(0);
  const [saveKey, setSaveKey] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [localChanges, setLocalChanges] = useState<any>({});
  const [sortedInverse, setSortedInverse] = useState(true);

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

  async function handleNext() {
    if (
      typeof prop.onFetch === "function" &&
      recordCount + offset !== total_count
    ) {
      const data = await prop.onFetch(page_size, pageNumber + 1);
      if (data) {
        setData(data);
        setRecordCount(data.length);
        setPageNumber(pageNumber + 1);
        setOffset(offset + page_size);
      }
    }
  }

  async function handlePrevious() {
    if (typeof prop.onFetch === "function" && pageNumber > 1) {
      const data = await prop.onFetch(page_size, pageNumber - 1);
      if (data) {
        setData(data);
        setRecordCount(data.length);
        setPageNumber(pageNumber - 1);
        setOffset(offset - page_size);
      }
    }
  }

  function handleCancel() {
    setLocalChanges({});
    setUnsavedChanges(false);
    setResetKey(resetKey + 1);
  }

  function handleSort(column: string) {
    setSortedInverse(!sortedInverse);
    const sortedData = sortObjectsByKey([...data], column, sortedInverse);
    setData(sortedData);
    setUnsavedChanges(false);
    setResetKey(resetKey + 1);
  }

  useEffect(() => {
    setData(prop.data);
  }, [prop.data]);

  return (
    <div>
      <div className="">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase"
                      >
                        <div className="flex items-center">
                          {column.label}
                          <a onClick={() => handleSort(column.label)}>
                            <ArrowsUpDownIcon className="w-3 h-3 ml-1.5 hover:cursor-pointer" />
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
                            key={`${rowIndex}-${colIndex}`}
                            className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 max-w-xxs"
                          >
                            <div className="max-w-xxs overflow-hidden hover:overflow-auto">
                              {column.isEditable ? (
                                <EditableCell
                                  key={`${row.id}-${column.label}`}
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
      {total_count > 0 && (
        <nav
          className="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 z-10"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{1 + offset}</span> to{" "}
              <span className="font-medium">{recordCount + offset}</span> of{" "}
              <span className="font-medium">{total_count}</span> results
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <a
              className={`relative ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus-visible:outline-offset-0 ${
                pageNumber === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-900 hover:bg-gray-50 hover:cursor-pointer"
              }`}
              onClick={handlePrevious}
            >
              Previous
            </a>
            <a
              className={`relative ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus-visible:outline-offset-0 ${
                recordCount + offset === total_count
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50  text-gray-900 hover:cursor-pointer"
              }`}
              onClick={handleNext}
            >
              Next
            </a>
          </div>
        </nav>
      )}
    </div>
  );
}
