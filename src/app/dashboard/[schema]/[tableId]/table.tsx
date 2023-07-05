"use client";

import DataTable from "@/components/datatable";

const addEditableFlag = (columns: any[]): any[] => {
  return columns.map((column) => {
    if (["first_name", "last_name"].includes(column.label)) {
      return { ...column, isEditable: true };
    }
    return column;
  });
};

export default async function Table(props: any) {
  const response = await fetch(
    process.env.BASE_URL + "/api/tables/" + props.tableId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const jsonData = await response.json();
  if (jsonData.metadata.table_name === "user") {
    jsonData.metadata.columns = addEditableFlag(jsonData.metadata.columns);
  }
  return <DataTable columns={jsonData.metadata.columns} data={jsonData.data} />;
}
