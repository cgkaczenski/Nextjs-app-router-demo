import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import userService from "@/services/user";

// change password if session and old password are valid
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const email = session.user?.email as string;
  const { oldPassword, newPassword } = body;

  try {
    await userService.changePassword(email, oldPassword, newPassword);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Password updated" }, { status: 200 });
}
