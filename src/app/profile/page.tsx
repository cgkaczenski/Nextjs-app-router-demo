import Link from "next/link";
import { Fragment } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  console.log("app router session:", session);

  if (!session) {
    redirect("/authform");
  }

  return (
    <Fragment>
      <div>
        <h1>Hello, App Router Profile Page!</h1>
        <Link href="/">Home</Link>
      </div>
      <form>
        <label htmlFor="new-password">New Password</label>
        <input id="new-email" type="password" />
        <label htmlFor="old-password">Old Password</label>
        <input id="old-password" type="password" />
        <button type="submit">Submit</button>
      </form>
    </Fragment>
  );
}
