import postgres from "postgres";
//import { User } from "../../next-auth";

export interface Database {
  // Todo: these should return a user instead
  getUserByEmail(email: string): Promise<postgres.RowList<postgres.Row[]>>;
  getUserById(id: string): Promise<postgres.RowList<postgres.Row[]>>;
  // Todo: this should take a user as param instead
  insertUser(email: string, password: string): Promise<postgres.Row>;
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
    return user[0];
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
