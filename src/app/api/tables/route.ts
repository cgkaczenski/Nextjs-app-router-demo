import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  function addLink(data: any[]) {
    return data.map((item) => ({
      ...item,
      link: `/dashboard/${item.schema}/${item.id}`,
    }));
  }

  const columns: { label: string; data_type: string }[] = [
    { label: "id", data_type: "string" },
    { label: "schema", data_type: "string" },
    { label: "name", data_type: "string" },
    { label: "link", data_type: "string" },
  ];
  const metadata = { table_name: "All Tables", columns: columns };
  let data = (await db.getAllTables()) as any[];
  data = addLink(data);
  const response = { metadata, data };
  return NextResponse.json(response, { status: 200 });
}
