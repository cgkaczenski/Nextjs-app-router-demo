import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DataTable from "@/components/datatable";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  function addLink(data: any[]) {
    return data.map((item) => ({
      ...item,
      link: `/dashboard/${item.schema}/${item.id}`,
    }));
  }

  const response = await fetch(process.env.BASE_URL + "/api/tables", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  let data = await response.json();
  data = addLink(data);
  const columnNames = data.length > 0 ? Object.keys(data[0]) : [];
  return <DataTable columnNames={columnNames} data={data} link={true} />;
}
