import db from "@/lib/db";
import { sendResetEmail, sendVerificationEmail } from "@/services/email";
import { hashPassword, verifyPassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(email: string): Promise<User>;
  update(user: User): Promise<User>;
}

class UserService {
  database: UserRepository;

  constructor(database: UserRepository) {
    this.database = database;
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.database.findByEmail(email);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.database.findByEmail(email);
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
    const user = await this.database.findById(id);
    if (!user) {
      throw new Error("Could not find user");
    }
    const secretKey = process.env.JWT_SECRET + user.password;

    try {
      jwt.verify(token, secretKey);
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
      await this.database.update(user);
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
    const user = await this.database.findByEmail(email);
    if (!user) {
      throw new Error("Could not find user");
    }
    const passwordsMatch = await verifyPassword(oldPassword, user.password);
    if (!passwordsMatch) {
      throw new Error("Invalid password");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await this.database.update(user);
  }

  async registerUser(email: string): Promise<User> {
    const existingUser = await this.database.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const user = await this.database.create(email);
    const response = await sendVerificationEmail(user.id, email);

    if (response[0].statusCode !== 202) {
      throw new Error(response[0].toString());
    }

    return user as User;
  }

  async verifyUser(id: string, token: string, password: string): Promise<void> {
    try {
      const user = await this.database.findById(id);
      if (!user) {
        throw new Error("Could not find user");
      }
      if (user.isVerified || user.password) {
        throw new Error("User already verified");
      }
      const secretKey = process.env.JWT_SECRET + id;
      jwt.verify(token, secretKey);
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
      await this.database.update(user);
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
