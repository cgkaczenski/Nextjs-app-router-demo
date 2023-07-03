import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
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
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
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
  return <DataTable columns={jsonData.metadata.columns} data={jsonData.data} />;
}
