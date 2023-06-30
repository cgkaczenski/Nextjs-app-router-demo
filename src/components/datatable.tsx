import Link from "next/link";

export default function DataTable(prop: {
  columnNames: string[];
  data: any[];
  link?: boolean;
}) {
  const { columnNames, data, link } = prop;

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columnNames.map((columnName, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {columnName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columnNames.map((columnName, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {link && columnName === "link" ? (
                            <a
                              href={row[columnName]}
                              className="text-sm text-blue-600 hover:text-blue-900"
                            >
                              {row[columnName]}
                            </a>
                          ) : (
                            <div className="text-sm text-gray-900">
                              {row[columnName]}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columnNames.length}
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
  );
}
