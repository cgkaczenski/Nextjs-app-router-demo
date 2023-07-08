"use client";

import DataTable from "@/components/datatable";
import toast from "react-hot-toast";

export default async function Table(props: { tableId: string; jsonData: any }) {
  const { jsonData } = props;

  async function handleSave(changes: Record<string, any>) {
    const response = await fetch("/api/tables/" + props.tableId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(changes),
    });
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

  return jsonData ? (
    <DataTable
      columns={jsonData.metadata.columns}
      data={jsonData.data}
      onSave={handleSave}
    />
  ) : (
    <div>Loading...</div>
  );
}
