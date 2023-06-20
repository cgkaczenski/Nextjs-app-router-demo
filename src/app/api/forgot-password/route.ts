import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import { getUserByEmail, getUserById, updateUserPassword } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const BASE_URL = process.env.BASE_URL as string;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;
sgMail.setApiKey(SENDGRID_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { enteredEmail } = body;

  const userResult = await getUserByEmail(enteredEmail);
  if (userResult.count === 0) {
    return NextResponse.json({ error: "Email not found" }, { status: 401 });
  }
  const jwtPayload = {
    user: {
      id: userResult[0].id,
    },
  };
  const secretKey = process.env.JWT_SECRET + userResult[0].password;
  const token = jwt.sign(jwtPayload, secretKey, { expiresIn: "15m" });
  const url = `${BASE_URL}/forgot-password/${userResult[0].id}/${token}`;

  const text = "Please vist the following page to reset your password: " + url;
  const html = `<p>Please reset your password <a href="${url}">here</a>.</p>
  <p>This link will expire in 15 minutes.</p>
  <p>If you did not request a password reset, please ignore this email.</p>`;

  const msg = {
    to: enteredEmail, // recipient email
    from: ADMIN_EMAIL, // sender email
    subject: "Reset your password",
    text: text,
    html: html,
  };

  const response = await sgMail.send(msg);

  if (response[0].statusCode !== 202) {
    return NextResponse.json({ error: response }, { status: 401 });
  }

  return NextResponse.json({ message: "Email Sent" }, { status: 200 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { userId, token, newPassword } = body;
  let userResult;
  try {
    userResult = await getUserById(userId);
    if (userResult.count === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const user = userResult[0];
  const secretKey = process.env.JWT_SECRET + user.password;

  try {
    jwt.verify(token, secretKey);
    const hashedPassword = await hashPassword(newPassword);
    await updateUserPassword(userId, hashedPassword);
    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (err: any) {
    if (err.message === "jwt expired") {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
