import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getUserQueryResult, updateUserPassword } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const email = session.user?.email as string;
  console.log(email);
  const { oldPassword, newPassword } = body;

  const userResult = await getUserQueryResult(email);
  if (userResult.count === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const user = userResult[0];

  const passwordsMatch = await verifyPassword(oldPassword, user.password);
  if (!passwordsMatch) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const hashedPassword = await hashPassword(newPassword);
  await updateUserPassword(user.id, hashedPassword);
  return NextResponse.json({ message: "Password updated" }, { status: 200 });
}
