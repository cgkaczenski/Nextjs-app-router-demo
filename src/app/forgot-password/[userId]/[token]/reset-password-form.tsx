"use client";

import { useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm(props: {
  userId: string;
  token: string;
}) {
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  async function submitHandler(event: any) {
    event.preventDefault();
    const enteredPassword = passwordInputRef.current?.value;
    const response = await fetch("/api/forgot-password", {
      method: "PATCH",
      body: JSON.stringify({
        userId: props.userId,
        token: props.token,
        newPassword: enteredPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
    }
    if (response.ok) {
      toast.success("Password updated successfully!");
      router.push("/auth");
    }
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Reset Password</h3>
          <p className="text-sm text-gray-500">
            Please enter your new password, and then we&apos;ll redirect you to
            the login page.
          </p>
        </div>
        <form
          onSubmit={submitHandler}
          className="flex flex-col bg-gray-50 px-4 py-4 sm:px-16"
        >
          <label
            htmlFor="password"
            className="block text-xs text-gray-600 uppercase"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            ref={passwordInputRef}
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
          <div className="py-4">
            <button className="border-black bg-black text-white hover:bg-white hover:text-black lex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none">
              Create new password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
