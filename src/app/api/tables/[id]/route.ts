import { NextResponse } from "next/server";
import db from "@/lib/db";

interface Columns {
  table_name: string;
  column_name: string;
  data_type: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const result = await db.getAllColumns(params.id);
  // Todo: add this to a meta field in the response, and get the column names
  // from this instead of from the datatable.
  const columns: Columns[] = result.map((row) => {
    return {
      table_name: row.table_name,
      column_name: row.column_name,
      data_type: row.data_type,
    };
  });
  const tableName = columns[0].table_name;
  const data = await db.getTableData(tableName);
  return NextResponse.json(data, { status: 200 });
}
