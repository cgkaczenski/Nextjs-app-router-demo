"use client";

import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default async function UserVerificationPage() {
  const { userId, token } = useParams();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function submitHandler(event: any) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;
    const response = await fetch(process.env.BASE_URL + "/api/auth/signup", {
      method: "PATCH",
      body: JSON.stringify({
        userId: userId,
        token: token,
        password: enteredPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log("enteredEmail", enteredEmail);
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      if (!result?.error) {
        toast.success("Account activated!");
        router.replace("/");
      } else {
        toast.error(result.error);
      }
    }
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.error);
    }
  }

  return (
    <div className="flex">
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Password setup</h3>
            <p className="text-sm text-gray-500">
              Please enter your email and a password to finish setting up your
              account.
            </p>
          </div>
          <form
            onSubmit={submitHandler}
            className="flex flex-col bg-gray-50 px-4 py-4 sm:px-16"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-gray-600 uppercase pt-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                ref={emailInputRef}
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              />
              <label
                htmlFor="password"
                className="block text-xs text-gray-600 uppercase pt-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                ref={passwordInputRef}
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              />
            </div>
            <div className="py-4">
              <button className="border-black bg-black text-white hover:bg-white hover:text-black lex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none">
                Save Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
