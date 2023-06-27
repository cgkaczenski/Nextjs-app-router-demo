import postgres from "postgres";
import { hashPassword } from "./auth";
//import { User } from "../../next-auth";

interface Database {
  // Todo: these should return a user instead
  getUserByEmail(email: string): Promise<postgres.RowList<postgres.Row[]>>;
  getUserByEmail(id: string): Promise<postgres.RowList<postgres.Row[]>>;
  // Todo: this should take a user as param instead
  insertUser(email: string, password: string): Promise<postgres.Row>;
  updateUserPassword(id: number, password: string): Promise<void>;
  verifyUser(id: number): Promise<void>;
}

class postgresDatabase implements Database {
  sql: postgres.Sql<{}>;

  constructor(private connectionString: string, private ssl: string) {
    this.sql = postgres(connectionString, {
      ssl: {
        ca: Buffer.from(ssl, "base64").toString(),
      },
      idle_timeout: 20,
      max_lifetime: 30 * 60,
    });
  }

  async getUserByEmail(email: string) {
    const userResult = await this.sql`
      select id, email, password, is_verified
      from users 
      where email = ${email}
    `;
    return userResult;
  }

  async getUserById(id: string) {
    const userResult = await this.sql`
      select id, email, password, is_verified
      from users 
      where id = ${id}
    `;
    return userResult;
  }

  async insertUser(email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const user = await this.sql`
      insert into users (
        email, password
      ) values (
        ${email}, ${hashedPassword}
      )

      returning *
    `;
    if (user.count === 0) {
      throw new Error("Could not insert user!");
    }
    return user[0];
  }

  async updateUserPassword(id: number, password: string) {
    const user = await this.sql`
      update users
      set password = ${password}
      where id = ${id}
    `;
    if (user.count === 0) {
      throw new Error("Could not update user!");
    }
  }

  async verifyUser(id: number) {
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

const postgresDb = new postgresDatabase(
  process.env.DATABASE_URL as string,
  process.env.DATABASE_SSL_CERT as string
);

export default postgresDb;
