import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import DataTable from "@/components/datatable";
import { type } from "os";

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
  return <DataTable columns={jsonData.metadata.columns} data={jsonData.data} />;
}
