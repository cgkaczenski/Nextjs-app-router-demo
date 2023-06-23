import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const BASE_URL = process.env.BASE_URL as string;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;
sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendResetEmail(
  userId: string,
  userPassword: string,
  toEmail: string
) {
  const jwtPayload = {
    user: {
      id: userId,
    },
  };
  const secretKey = process.env.JWT_SECRET + userPassword;
  const token = jwt.sign(jwtPayload, secretKey, { expiresIn: "15m" });
  const url = `${BASE_URL}/forgot-password/${userId}/${token}`;

  const text = "Please vist the following page to reset your password: " + url;
  const html = `<p>Please reset your password <a href="${url}">here</a>.</p>
  <p>This link will expire in 15 minutes.</p>
  <p>If you did not request a password reset, please ignore this email.</p>`;

  const msg = {
    to: toEmail, // recipient email
    from: ADMIN_EMAIL, // sender email
    subject: "Reset your password",
    text: text,
    html: html,
  };

  return await sgMail.send(msg);
}

export async function sendVerificationEmail(
  userId: string,
  userPassword: string,
  toEmail: string
) {
  const jwtPayload = {
    user: {
      id: userId,
    },
  };
  const secretKey = process.env.JWT_SECRET + userPassword;
  const token = jwt.sign(jwtPayload, secretKey);
  const url = `${BASE_URL}/verify-user/${userId}/${token}`;

  const text =
    "Welcome to your account! Please vist the following page to verify your account: " +
    url;
  const html = `<p>Welcome to your account!</p>
  <p>Please verify your account <a href="${url}">here</a>.</p>`;

  const msg = {
    to: toEmail, // recipient email
    from: ADMIN_EMAIL, // sender email
    subject: "Welcome to your account! Please verify your email.",
    text: text,
    html: html,
  };

  return await sgMail.send(msg);
}
