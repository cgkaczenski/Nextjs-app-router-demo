import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  function generateLinks(data: any[]) {
    return data.map((item) => {
      return {
        label: item.name, // modify according to your requirement, it could be item.id, item.schema, or item.name
        href: `/dashboard/${item.schema}/${item.id}`,
      };
    });
  }

  const columns: { label: string; data_type: string }[] = [
    { label: "id", data_type: "string" },
    { label: "schema", data_type: "string" },
    { label: "name", data_type: "string" },
  ];
  let data = (await db.getAllTables()) as any[];
  const links = generateLinks(data);
  const metadata = { table_name: "All Tables", links: links, columns: columns };
  const response = { metadata, data };
  return NextResponse.json(response, { status: 200 });
}
