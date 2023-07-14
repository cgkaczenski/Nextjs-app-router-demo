import { getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
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
      Cookie: cookies().toString(),
    },
    cache: "no-cache",
  });

  const jsonData = await response.json();
  const links = {
    column_name: "id",
    matching_key: "name",
    links: jsonData.metadata.links as { label: string; href: string }[],
  };
  return (
    <div className="px-6 py-3 mx-auto">
      <DataTable
        columns={jsonData.metadata.columns}
        data={jsonData.data}
        links={links}
        page_size={jsonData.metadata.page_size}
        page_number={jsonData.metadata.page_number}
        record_count={jsonData.metadata.record_count}
        total_count={jsonData.metadata.total_count}
      />
    </div>
  );
}
