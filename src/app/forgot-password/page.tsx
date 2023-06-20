"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordForm() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  async function forgotPasswordHandler(event: any) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current?.value;
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ enteredEmail }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
    }
    if (response.ok) {
      setIsEmailSent(true);
      toast.success(data.message);
    }
  }

  return (
    <section>
      {isEmailSent && (
        <p className="flex h-screen w-screen items-center justify-center text-xl">
          An email has been sent to the address you provided. Please check your
          inbox. If you do not see the email, please check your spam folder.
        </p>
      )}
      {!isEmailSent && (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
            <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
              <h3 className="text-xl font-semibold">Forgot Password</h3>
              <p className="text-sm text-gray-500">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>
            <form
              onSubmit={forgotPasswordHandler}
              className="flex flex-col bg-gray-50 px-4 py-4 sm:px-16"
            >
              <label
                htmlFor="email"
                className="block text-xs text-gray-600 uppercase"
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
              <div className="py-4">
                <button className="border-black bg-black text-white hover:bg-white hover:text-black lex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none">
                  Send password reset link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
