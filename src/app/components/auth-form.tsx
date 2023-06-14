"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthForm() {
  const router = useRouter();

  async function submitHandler(event: any) {
    event.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email: "test",
      password: "test",
    });

    if (!result?.error) {
      router.replace("/");
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" />
      <button type="submit">Submit</button>
    </form>
  );
}
