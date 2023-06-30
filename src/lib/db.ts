import postgres from "postgres";
import { User } from "@/services/user";

export interface Database {
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  insertUser(email: string): Promise<User>;
  updateUserPassword(id: string, password: string): Promise<void>;
  verifyUser(id: string, password: string): Promise<void>;
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
      from system.users 
      where email = ${email}
    `;
    if (userResult.count === 0) {
      return null;
    }
    return this.convertRowToUser(userResult[0]);
  }

  async getUserById(id: string) {
    const userResult = await this.sql`
      select id, email, password, is_verified
      from system.users 
      where id = ${id}
    `;
    if (userResult.count === 0) {
      return null;
    }
    return this.convertRowToUser(userResult[0]);
  }

  async insertUser(email: string) {
    const userResult = await this.sql`
      insert into system.users (
        email
      ) values (
        ${email}
      )

      returning *
    `;
    if (userResult.count === 0) {
      throw new Error("Could not insert user!");
    }
    return this.convertRowToUser(userResult[0]);
  }

  async updateUserPassword(id: string, password: string) {
    const user = await this.sql`
      update system.users
      set password = ${password}
      where id = ${id}
    `;
    if (user.count === 0) {
      throw new Error("Could not update user!");
    }
  }

  async verifyUser(id: string, password: string) {
    const user = await this.sql`
      update system.users
      set is_verified = true, password = ${password}
      where id = ${id}
    `;
    if (user.count === 0) {
      throw new Error("Could not verify user!");
    }
  }

  async getAllTables() {
    const tables = await this.sql`
    SELECT
      c.oid :: int8 AS id,
      nc.nspname AS schema,
      c.relname AS name
    FROM
      pg_namespace nc
      JOIN pg_class c ON nc.oid = c.relnamespace
    WHERE
      c.relkind IN ('r', 'p')
      AND nc.nspname = 'public'
      AND NOT pg_is_other_temp_schema(nc.oid)
      AND (
        pg_has_role(c.relowner, 'USAGE')
        OR has_table_privilege(
          c.oid,
          'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'
        )
        OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
      )
    `;
    return tables;
  }

  async getTableData(tableName: string) {
    console.log("tableName", tableName);
    const data = await this.sql`
    select * from ${this.sql(tableName)}
  `;
    return data;
  }

  async getAllColumns(tableId: number) {
    const columns = await this.sql`
    SELECT 
        c.relname AS table_name,
        a.attname AS column_name, 
        pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type
    FROM 
        pg_catalog.pg_attribute a
    JOIN 
        pg_catalog.pg_class c ON a.attrelid = c.oid
    JOIN 
        pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE 
        c.oid = ${tableId}
        AND a.attnum > 0 -- only consider attribute (column) numbers that are positive
        AND NOT a.attisdropped -- exclude dropped columns
    ORDER BY 
        a.attnum;
  `;
    return columns;
  }
}

const db = new postgresDatabase(
  process.env.DATABASE_URL as string,
  process.env.DATABASE_SSL_CERT as string
);

export default db;
