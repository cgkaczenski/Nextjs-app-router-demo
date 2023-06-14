import Link from "next/link";
import { Fragment } from "react";

export default function HomePage() {
  // Using <a> tag to navigate to profile page instead of Link,
  // because I want to force a request to the server to get the session
  // kind of defeats the purpose of using nextjs though...
  return (
    <Fragment>
      <div>
        <h1>Hello Next.js 👋</h1>
        <a href="/profile">Profile</a>
      </div>
      <div>
        <Link href="/authform">Auth Form</Link>
      </div>
    </Fragment>
  );
}
