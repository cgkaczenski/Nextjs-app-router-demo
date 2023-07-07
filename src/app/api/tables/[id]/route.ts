import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import tableService from "@/services/table";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const response = await tableService.getTablesJsonById(params.id);
  return NextResponse.json(response, { status: 200 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  try {
    await tableService.updateRowsByMap(body);
    return NextResponse.json({ message: "Save Successful!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error Saving!" }, { status: 500 });
  }
}
