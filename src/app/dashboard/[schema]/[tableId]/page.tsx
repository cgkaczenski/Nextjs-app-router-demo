"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/datatable";

const addEditableFlag = (columns: any[]): any[] => {
  return columns.map((column) => {
    if (["first_name", "last_name"].includes(column.label)) {
      return { ...column, isEditable: true };
    }
    return column;
  });
};

export default async function TablePage({
  params,
}: {
  params: { tableId: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    router.push("/auth");
  }

  const { tableId } = params;
  const response = await fetch(
    process.env.BASE_URL + "/api/tables/" + tableId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );

  const jsonData = await response.json();
  if (jsonData.metadata.table_name === "user") {
    jsonData.metadata.columns = addEditableFlag(jsonData.metadata.columns);
  }
  return (
    session && (
      <DataTable columns={jsonData.metadata.columns} data={jsonData.data} />
    )
  );
}
