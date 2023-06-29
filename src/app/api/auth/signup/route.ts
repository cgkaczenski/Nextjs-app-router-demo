import { NextResponse } from "next/server";
import userService from "@/services/user";

// Register a new user
export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  try {
    await userService.registerUser(email);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  return NextResponse.json("User created", { status: 201 });
}

// Verify a new user
export async function PATCH(request: Request) {
  const body = await request.json();
  const { userId, token, password } = body;
  try {
    await userService.verifyUser(userId, token, password);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  return NextResponse.json({ message: "User Verified" }, { status: 200 });
}
