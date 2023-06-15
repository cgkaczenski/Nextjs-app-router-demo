import postgres from "postgres";
import { hashPassword } from "./auth";

const sql = postgres(process.env.DATABASE_URL as string);

export async function getUserQueryResult(email: string) {
  const userResult = await sql`
    select id, email, password
    from users 
    where email = ${email}
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
