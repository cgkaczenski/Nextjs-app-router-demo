import postgres from "postgres";
import { hashPassword } from "./auth";
import tls from "tls";

const sql = postgres(process.env.DATABASE_URL as string, {
  ssl: {
    ca: Buffer.from(
      process.env.DATABASE_SSL_CERT as string,
      "base64"
    ).toString(),
  },
});

export async function getUserByEmail(email: string) {
  const userResult = await sql`
    select id, email, password
    from users 
    where email = ${email}
  `;
  return userResult;
}

export async function getUserById(id: string) {
  const userResult = await sql`
    select id, email, password
    from users 
    where id = ${id}
  `;
  return userResult;
}

export async function insertUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  const user = await sql`
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

export async function updateUserPassword(id: number, password: string) {
  const user = await sql`
    update users
    set password = ${password}
    where id = ${id}
    returning *
  `;
  if (user.count === 0) {
    throw new Error("Could not update user!");
  }
}
