import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import DataTable from "@/components/datatable";

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

  const data = await response.json();
  const columnNames = data.length > 0 ? Object.keys(data[0]) : [];
  return <DataTable columnNames={columnNames} data={data} />;
}
