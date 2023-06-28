import db, { Database } from "@/lib/db";
import { sendResetEmail, sendVerificationEmail } from "@/lib/email";
import { hashPassword, verifyPassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
}

class UserService {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const userResult = await this.database.getUserByEmail(email);
    if (userResult.count === 0) {
      throw new Error("User not found");
    }

    const response = await sendResetEmail(
      userResult[0].id,
      userResult[0].password,
      userResult[0].email
    );

    if (response[0].statusCode !== 202) {
      throw new Error(response[0].toString());
    }
  }

  async updateUserPasswordIfTokenValid(
    id: string,
    password: string,
    token: string
  ): Promise<void> {
    const userResult = await this.database.getUserById(id);
    if (userResult.count === 0) {
      throw new Error("User not found");
    }
    const user = userResult[0];
    const secretKey = process.env.JWT_SECRET + user.password;

    try {
      jwt.verify(token, secretKey);
      const hashedPassword = await hashPassword(password);
      await this.database.updateUserPassword(id, hashedPassword);
    } catch (err: any) {
      if (err.message === "jwt expired") {
        throw new Error("Token expired");
      }
      throw new Error("Invalid token");
    }
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const userResult = await this.database.getUserByEmail(email);
    if (userResult.count === 0) {
      throw new Error("User not found");
    }
    const user = userResult[0];

    const passwordsMatch = await verifyPassword(oldPassword, user.password);
    if (!passwordsMatch) {
      throw new Error("Invalid password");
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.database.updateUserPassword(user.id, hashedPassword);
  }

  async registerUser(email: string, password: string): Promise<User> {
    const existingUser = await this.database.getUserByEmail(email);
    if (existingUser.count > 0) {
      throw new Error("User already exists");
    }
    const hashedPassword = await hashPassword(password);
    const user = await this.database.insertUser(email, hashedPassword);
    const response = await sendVerificationEmail(
      user.id,
      user.password,
      user.email
    );

    if (response[0].statusCode !== 202) {
      throw new Error(response[0].toString());
    }

    return user as User;
  }

  async verifyUser(id: string, token: string): Promise<void> {
    const userResult = await this.database.getUserById(id);
    if (userResult.count === 0) {
      throw new Error("User not found");
    }
    const user = userResult[0];
    const secretKey = process.env.JWT_SECRET + user.password;

    try {
      jwt.verify(token, secretKey);
      await this.database.verifyUser(id);
    } catch (err: any) {
      if (err.message === "jwt expired") {
        throw new Error("Token expired");
      }
      throw new Error("Invalid token");
    }
  }
}

const userService = new UserService(db);
export default userService;
