import { NextResponse } from "next/server";
import db from "@/lib/db";

interface MetaData {
  table_name: string;
  columns: Columns[];
}

interface Columns {
  label: string;
  data_type: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const result = await db.getAllColumns(params.id);
  const tableName = result[0].table_name;
  const columns: Columns[] = result.map((row) => {
    return {
      label: row.column_name,
      data_type: row.data_type,
    };
  });
  const metadata: MetaData = { table_name: tableName, columns: columns };
  const data = await db.getTableData(tableName);
  const response = { metadata, data };
  return NextResponse.json(response, { status: 200 });
}
