import Link from "next/link";
import { Fragment } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProfileForm from "../components/profile-form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/authform");
  }

  return (
    <Fragment>
      <div>
        <h1>Hello, App Router Profile Page!</h1>
        <Link href="/">Home</Link>
      </div>
      <ProfileForm />
    </Fragment>
  );
}
