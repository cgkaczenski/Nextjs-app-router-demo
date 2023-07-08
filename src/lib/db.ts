import postgres from "postgres";
import { User, UserRepository } from "@/services/user";
import { TableList, Table, RowMap, TableRepository } from "@/services/table";

class postgresDatabase implements UserRepository, TableRepository {
  sql: postgres.Sql<{}>;
  transformer: DataTransformer;

  constructor(connectionString: string, ssl: string) {
    this.sql = postgres(connectionString, {
      ssl: {
        ca: Buffer.from(ssl, "base64").toString(),
      },
      idle_timeout: 20,
      max_lifetime: 30 * 60,
    });
    this.transformer = new DataTransformer();
  }

  public async findById(id: string) {
    const userResult = await this.sql`
      select id, email, password, is_verified
      from system.users 
      where id = ${id}
    `;
    if (userResult.count === 0) {
      return null;
    }
    return this.transformer.convertRowToUser(userResult[0]);
  }

  public async findByEmail(email: string) {
    const userResult = await this.sql`
      select id, email, password, is_verified
      from system.users 
      where email = ${email}
    `;
    if (userResult.count === 0) {
      return null;
    }
    return this.transformer.convertRowToUser(userResult[0]);
  }

  public async create(email: string) {
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
    return this.transformer.convertRowToUser(userResult[0]);
  }

  public async update(user: User): Promise<User> {
    const userResult = await this.sql`
      update system.users
      set password = ${user.password}, is_verified = ${user.isVerified}
      where id = ${user.id}

      returning *
    `;
    if (userResult.count === 0) {
      throw new Error("Could not update user!");
    }
    return this.transformer.convertRowToUser(userResult[0]);
  }

  public async findAllTables(): Promise<TableList[]> {
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
    return this.transformer.convertRowsToTableList(tables);
  }

  public async findTableById(id: number) {
    const tableMeta = await this.getTableMetadata(id);
    const data = await this.getTableData(tableMeta.table_name);
    const table: Table = {
      tableMetadata: tableMeta,
      data: data,
    };
    return table;
  }

  public async updateRowsByMap(rows: RowMap): Promise<void> {
    try {
      await this.sql.begin(async (sql) => {
        for (const rowKey in rows) {
          const row = rows[rowKey];

          const updates: { [key: string]: string | number | boolean } = {};

          for (const key in row) {
            if (key !== "id") {
              updates[key] = row[key];
            }
          }

          if (Object.keys(updates).length > 0) {
            await sql`UPDATE public.user SET ${sql(updates)} WHERE id = ${
              row.id
            }`;
          }
        }
      });
    } catch (error) {
      throw new Error("Could not update rows!");
    }
  }

  private async getTableData(tableName: string): Promise<{}[]> {
    const data = await this.sql`
    select * from ${this.sql(tableName)}
  `;
    return data;
  }

  private async getTableMetadata(tableId: number): Promise<{
    id: number;
    table_name: string;
    columns: { label: string; data_type: string }[];
  }> {
    let columns = await this.sql`
    SELECT 
        c.relname AS table_name,
        a.attname AS column_name, 
        pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
        ca.input_type AS input_type
    FROM 
        pg_catalog.pg_attribute a
    JOIN 
        pg_catalog.pg_class c ON a.attrelid = c.oid
    JOIN 
        pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    LEFT JOIN 
        system.attribute ca ON ca.table_id = c.oid AND ca.column_name = a.attname
    WHERE 
        c.oid = ${tableId}
        AND a.attnum > 0 -- only consider attribute (column) numbers that are positive
        AND NOT a.attisdropped -- exclude dropped columns
    ORDER BY 
        a.attnum;
  `;
    columns = this.transformer.transformDataType(columns);
    return this.transformer.convertRowsToTableMetadata(tableId, columns);
  }
}

class DataTransformer {
  convertRowToUser(row: postgres.Row): User {
    return {
      id: row.id,
      name: row.email,
      email: row.email,
      password: row.password,
      isVerified: row.is_verified,
    };
  }

  convertRowsToTableList(rows: postgres.Row[]): TableList[] {
    return rows.map((row) => {
      return {
        id: row.id,
        schema: row.schema,
        name: row.name,
      };
    });
  }

  convertRowsToTableMetadata(
    id: number,
    rows: postgres.Row[]
  ): {
    id: number;
    table_name: string;
    columns: { label: string; data_type: string; input_type: string | null }[];
  } {
    return {
      id: id,
      table_name: rows[0].table_name,
      columns: this.convertRowsToColumnMetadata(rows),
    };
  }

  convertRowsToColumnMetadata(
    rows: postgres.Row[]
  ): { label: string; data_type: string; input_type: string | null }[] {
    return rows.map((row) => {
      return {
        label: row.column_name,
        data_type: row.data_type,
        input_type: row.input_type,
      };
    });
  }

  transformDataType(data: any): any {
    return data.map((item: any) => {
      if (item.data_type === "boolean") {
        return item;
      } else if (item.data_type === "timestamp with time zone") {
        return { ...item, data_type: "datetime" };
      } else {
        return { ...item, data_type: "text" };
      }
    });
  }
}

const db = new postgresDatabase(
  process.env.DATABASE_URL as string,
  process.env.DATABASE_SSL_CERT as string
);

export default db;
