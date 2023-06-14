import Link from "next/link";
import { Fragment } from "react";

export default function ProfilePage() {
  return (
    <Fragment>
      <div>
        <h1>Hello, Profile Page!</h1>
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
