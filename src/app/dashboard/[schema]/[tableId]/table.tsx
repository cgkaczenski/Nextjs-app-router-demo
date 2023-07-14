"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/datatable";
import toast from "react-hot-toast";

export default function Table(props: { tableId: string; jsonData: any }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
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
      page_size={jsonData.metadata.page_size}
      page_number={jsonData.metadata.page_number}
      record_count={jsonData.metadata.record_count}
      total_count={jsonData.metadata.total_count}
    />
  ) : (
    <div>Loading...</div>
  );
}
