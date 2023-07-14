import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import tableService from "@/services/table";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
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
  const { searchParams } = new URL(request.url);
  let pageSize, pageNumber;
  if (searchParams.has('page_size') && searchParams.has('page_number')) {
    pageSize = Number(searchParams.get('page_size'));
    pageNumber = Number(searchParams.get('page_number'));
  }
  if (pageSize && pageNumber) {
    const response = await tableService.getTablesJsonById(params.id, pageSize, pageNumber);
    return NextResponse.json(response, { status: 200, headers: corsHeaders });
  }

  const response = await tableService.getTablesJsonById(params.id);
  return NextResponse.json(response, { status: 200, headers: corsHeaders });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT",
  };
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }
  const body = await request.json();
  try {
    await tableService.updateRowsByMap(body);
    return NextResponse.json(
      { message: "Save Successful!" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error Saving!" },
      { status: 500, headers: corsHeaders }
    );
  }
}
