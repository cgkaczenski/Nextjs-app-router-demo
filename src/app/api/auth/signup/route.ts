import { NextResponse } from "next/server";
import postgres from "postgres";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  const connectionString = process.env.DATABASE_URL as string;
  const sql = postgres(connectionString);

  const existingUser = await sql`
    select email, password
    from users 
    where email = ${email}
  `;

  if (existingUser.count > 0) {
    console.log("existingUser: ", existingUser);
    return NextResponse.json({ error: "User already exists" }, { status: 422 });
  }

  const users = await sql`
    insert into users (
      email, password
    ) values (
      ${email}, ${password}
    )

    returning *
  `;

  console.log("postgres:", users);

  return NextResponse.json(body);
}
