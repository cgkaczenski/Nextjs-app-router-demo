import postgres from "postgres";
import { User } from "@/services/user";

export interface Database {
  getUserByEmail(email: string): Promise<User>;
  getUserById(id: string): Promise<User>;
  insertUser(email: string, password: string): Promise<User>;
  updateUserPassword(id: string, password: string): Promise<void>;
  verifyUser(id: string): Promise<void>;
}

class postgresDatabase implements Database {
  sql: postgres.Sql<{}>;

  constructor(connectionString: string, ssl: string) {
    this.sql = postgres(connectionString, {
      ssl: {
        ca: Buffer.from(ssl, "base64").toString(),
      },
      idle_timeout: 20,
      max_lifetime: 30 * 60,
    });
  }

  convertRowToUser(row: postgres.Row) {
    return {
      id: row.id,
      name: row.email,
      email: row.email,
      password: row.password,
      isVerified: row.is_verified,
    } as User;
  }

  async getUserByEmail(email: string) {
    const userResult = await this.sql`
      select id, email, password, is_verified
      from users 
      where email = ${email}
    `;
    if (userResult.count === 0) {
      throw new Error("User not found");
    }
    return this.convertRowToUser(userResult[0]);
  }

  async getUserById(id: string) {
    const userResult = await this.sql`
      select id, email, password, is_verified
      from users 
      where id = ${id}
    `;
    if (userResult.count === 0) {
      throw new Error("User not found");
    }
    return this.convertRowToUser(userResult[0]);
  }

  async insertUser(email: string, password: string) {
    const user = await this.sql`
      insert into users (
        email, password
      ) values (
        ${email}, ${password}
      )

      returning *
    `;
    if (user.count === 0) {
      throw new Error("Could not insert user!");
    }
    return this.convertRowToUser(user);
  }

  async updateUserPassword(id: string, password: string) {
    const user = await this.sql`
      update users
      set password = ${password}
      where id = ${id}
    `;
    if (user.count === 0) {
      throw new Error("Could not update user!");
    }
  }

  async verifyUser(id: string) {
    const user = await this.sql`
      update users
      set is_verified = true
      where id = ${id}
    `;
    if (user.count === 0) {
      throw new Error("Could not verify user!");
    }
  }
}

const db = new postgresDatabase(
  process.env.DATABASE_URL as string,
  process.env.DATABASE_SSL_CERT as string
);

export default db;
