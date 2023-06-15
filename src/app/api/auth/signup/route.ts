import { NextResponse } from "next/server";
import { getUserQueryResult, insertUser } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;
  const existingUser = await getUserQueryResult(email);
  if (existingUser.count > 0) {
    console.log("existingUser: ", existingUser);
    return NextResponse.json({ error: "User already exists" }, { status: 422 });
  }

  const user = await insertUser(email, password);
  console.log("postgres:", user);

  return NextResponse.json(body);
}
