import Link from "next/link";
import { Fragment } from "react";

export default function HomePage() {
  return (
    <Fragment>
      <div>
        <h1>Hello Next.js 👋</h1>
        <Link href="/profile">Profile</Link>
      </div>
      <div>
        <Link href="/authform">Auth Form</Link>
      </div>
    </Fragment>
  );
}
