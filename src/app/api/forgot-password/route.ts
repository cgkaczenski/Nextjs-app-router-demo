import { NextResponse } from "next/server";
import userService from "@/services/user";

// Send reset password email
export async function POST(request: Request) {
  const body = await request.json();
  const { enteredEmail } = body;

  try {
    await userService.sendPasswordResetEmail(enteredEmail);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }

  return NextResponse.json({ message: "Email Sent" }, { status: 200 });
}

// Update user password if token is valid
export async function PATCH(request: Request) {
  const body = await request.json();
  const { userId, token, newPassword } = body;
  try {
    userService.updateUserPasswordIfTokenValid(userId, newPassword, token);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }

  return NextResponse.json({ message: "Password Updated" }, { status: 200 });
}
