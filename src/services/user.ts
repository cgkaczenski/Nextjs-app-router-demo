import db, { Database } from "@/lib/db";
import { sendResetEmail, sendVerificationEmail } from "@/lib/email";
import { hashPassword, verifyPassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
}

class UserService {
  database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.database.getUserByEmail(email);
    if (!user) {
      throw new Error("Could not find user");
    }
    const response = await sendResetEmail(user.id, user.password, user.email);

    if (response[0].statusCode !== 202) {
      throw new Error(response[0].toString());
    }
  }

  async updateUserPasswordIfTokenValid(
    id: string,
    password: string,
    token: string
  ): Promise<void> {
    const user = await this.database.getUserById(id);
    if (!user) {
      throw new Error("Could not find user");
    }
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
    const user = await this.database.getUserByEmail(email);
    if (!user) {
      throw new Error("Could not find user");
    }
    const passwordsMatch = await verifyPassword(oldPassword, user.password);
    if (!passwordsMatch) {
      throw new Error("Invalid password");
    }

    const hashedPassword = await hashPassword(newPassword);
    await this.database.updateUserPassword(user.id, hashedPassword);
  }

  async registerUser(email: string): Promise<User> {
    const existingUser = await this.database.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const user = await this.database.insertUser(email);
    const response = await sendVerificationEmail(user.id, email);

    if (response[0].statusCode !== 202) {
      throw new Error(response[0].toString());
    }

    return user as User;
  }

  async verifyUser(id: string, token: string, password: string): Promise<void> {
    try {
      const user = await this.database.getUserById(id);
      if (!user) {
        throw new Error("Could not find user");
      }
      if (user.isVerified || user.password) {
        throw new Error("User already verified");
      }
      const secretKey = process.env.JWT_SECRET + id;
      jwt.verify(token, secretKey);
      const hashedPassword = await hashPassword(password);
      await this.database.verifyUser(id, hashedPassword);
    } catch (err: any) {
      if (err.message === "jwt expired") {
        throw new Error("Token expired");
      }
      throw new Error("Invalid token or user");
    }
  }
}

const userService = new UserService(db);
export default userService;
