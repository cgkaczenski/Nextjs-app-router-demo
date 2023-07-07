import { NextResponse } from "next/server";
import tableService from "@/services/table";

export async function GET() {
  const response = await tableService.getAllTablesListJson();
  return NextResponse.json(response, { status: 200 });
}
