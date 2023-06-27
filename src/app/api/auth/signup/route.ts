import { NextResponse } from "next/server";
import postgresDb from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import jwt from "jsonwebtoken";

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

  const existingUser = await postgresDb.getUserByEmail(email);
  if (existingUser.count > 0) {
    return NextResponse.json(
      {
        error:
          "User already exists. Please reset your password if you need access to this account.",
      },
      { status: 422 }
    );
  }
  const user = await postgresDb.insertUser(email, password);
  const response = await sendVerificationEmail(
    user.id,
    user.password,
    user.email
  );

  if (response[0].statusCode !== 202) {
    return NextResponse.json({ error: response }, { status: 401 });
  }

  return NextResponse.json(user.id, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { userId, token } = body;
  let userResult;
  try {
    userResult = await postgresDb.getUserById(userId);
    if (userResult.count === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const user = userResult[0];
  if (user.is_verified) {
    return NextResponse.json(
      { message: "User already verified" },
      { status: 200 }
    );
  }

  const secretKey = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(token, secretKey);
    await postgresDb.verifyUser(userId);
    return NextResponse.json({ message: "User Verified" }, { status: 200 });
  } catch (err: any) {
    console.log("ERROR!!!:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
