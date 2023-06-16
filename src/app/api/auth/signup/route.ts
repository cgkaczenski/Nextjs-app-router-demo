import { NextResponse } from "next/server";
import { getUserQueryResult, insertUser } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !email.includes("@")) {
    NextResponse.json(
      {
        message: "Invalid input. Please enter a valid email address.",
      },
      { status: 422 }
    );
    return;
  }

  const existingUser = await getUserQueryResult(email);
  if (existingUser.count > 0) {
    return NextResponse.json({ error: "User already exists" }, { status: 422 });
  }
  const user = await insertUser(email, password);
  return NextResponse.json(user.id, { status: 201 });
}
