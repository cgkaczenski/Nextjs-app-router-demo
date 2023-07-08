import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import tableService from "@/services/table";

export async function GET() {
  const session = await getServerSession(authOptions);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
  };
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }
  const response = await tableService.getAllTablesListJson();
  return NextResponse.json(response, { status: 200, headers: corsHeaders });
}
