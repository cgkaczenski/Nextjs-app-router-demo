import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { cookies } from "next/headers";
import Table from "./table";

export default async function TablePage({
  params,
}: {
  params: { tableId: string };
}) {
  const session = await getServerSession(authOptions);
  const { tableId } = params;

  if (!session) {
    redirect("/auth");
  }

  function addEditableFlag(columns: any[]) {
    return columns.map((column) => {
      if (["first_name", "last_name"].includes(column.label)) {
        return { ...column, isEditable: true };
      }
      return column;
    });
  }

  const response = await fetch(
    process.env.BASE_URL + "/api/tables/" + tableId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      cache: "no-store",
    }
  );
  if (!response.ok) {
    return <div>error</div>;
  }
  let jsonData = await response.json();
  if (jsonData.metadata.table_name === "user") {
    jsonData.metadata.columns = addEditableFlag(jsonData.metadata.columns);
  }

  return (
    <div className="px-6 py-3 mx-auto">
      <Table tableId={tableId} jsonData={jsonData} />
    </div>
  );
}
