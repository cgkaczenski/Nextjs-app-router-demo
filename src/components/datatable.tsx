import Link from "next/link";

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
  columns: { label: string; data_type: string }[];
  data: any[];
  link?: boolean;
}) {
  const { columns, data, link } = prop;

  return (
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
                          {link && column.label === "link" ? (
                            <Link
                              href={row[column.label]}
                              className="text-sm text-blue-600 hover:text-blue-900"
                            >
                              {row[column.label]}
                            </Link>
                          ) : (
                            <div className="text-sm text-gray-900">
                              {formatValue(row[column.label], column.data_type)}
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
  );
}
