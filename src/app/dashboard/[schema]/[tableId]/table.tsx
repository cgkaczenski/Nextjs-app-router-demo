"use client";

import DataTable from "@/components/datatable";
import toast from "react-hot-toast";

const addEditableFlag = (columns: any[]): any[] => {
  return columns.map((column) => {
    if (["first_name", "last_name"].includes(column.label)) {
      return { ...column, isEditable: true };
    }
    return column;
  });
};

export default async function Table(props: any) {
  async function handleSave(changes: Record<string, any>) {
    const response = await fetch(
      process.env.BASE_URL + "/api/tables/" + props.tableId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(changes),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error);
      return false;
    }
    if (response.ok) {
      toast.success(data.message);
      return true;
    }
  }

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
  return (
    <DataTable
      columns={jsonData.metadata.columns}
      data={jsonData.data}
      onSave={handleSave}
    />
  );
}
