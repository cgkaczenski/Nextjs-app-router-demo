import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
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

  return <Table tableId={tableId} />;
}
