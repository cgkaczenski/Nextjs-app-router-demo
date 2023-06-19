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
      <form
        onSubmit={submitHandler}
        className="flex flex-col space-y-2 bg-gray-50 px-4 py-4 sm:px-16"
      >
        <label
          htmlFor="old-password"
          className="block text-xs text-gray-600 uppercase"
        >
          Current Password
        </label>
        <input
          id="old-password"
          type="password"
          ref={oldPasswordRef}
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
        <label
          htmlFor="new-password"
          className="block text-xs text-gray-600 uppercase"
        >
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          ref={newPasswordRef}
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
        <div className="pt-2">
          <button
            type="submit"
            className="border-black bg-black text-white hover:bg-white hover:text-black lex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none "
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}
