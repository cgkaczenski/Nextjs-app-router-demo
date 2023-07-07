import { NextResponse } from "next/server";
import tableService from "@/services/table";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const response = await tableService.getTablesJsonById(params.id);
  return NextResponse.json(response, { status: 200 });
}
