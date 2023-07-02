import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DataTable from "@/components/datatable";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const response = await fetch(process.env.BASE_URL + "/api/tables", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  const jsonData = await response.json();
  return (
    <DataTable
      columns={jsonData.metadata.columns}
      data={jsonData.data}
      link={true}
    />
  );
}
