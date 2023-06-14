import Link from "next/link";
import { Fragment } from "react";

export default function AuthFormPage() {
  return (
    <Fragment>
      <div>
        <h1>Hello, Auth Page!</h1>
        <Link href="/">Home</Link>
      </div>
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
        <button type="submit">Submit</button>
      </form>
    </Fragment>
  );
}
