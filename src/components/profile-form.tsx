"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

async function changeUserPassword(oldPassword: String, newPassword: String) {
  const response = await fetch("/api/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify({ oldPassword, newPassword }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong!");
  }

  return data;
}

export default function ProfileForm() {
  const router = useRouter();
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  async function submitHandler(event: any) {
    event.preventDefault();
    const enteredOldPassword = oldPasswordRef.current?.value;
    const enteredNewPassword = newPasswordRef.current?.value;

    if (enteredOldPassword && enteredNewPassword) {
      try {
        const changeResult = await changeUserPassword(
          enteredOldPassword,
          enteredNewPassword
        );
        console.log(changeResult);
        router.replace("/");
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section>
      <form onSubmit={submitHandler}>
        <label htmlFor="old-password">Old Password</label>
        <input id="old-password" type="password" ref={oldPasswordRef} />
        <label htmlFor="new-password">New Password</label>
        <input id="new-password" type="password" ref={newPasswordRef} />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}
