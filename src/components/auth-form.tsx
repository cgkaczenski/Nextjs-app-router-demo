"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

async function createUser(email: String, password: String) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

export default function AuthForm() {
  const router = useRouter();
  const [isLoginUI, setIsLoginUI] = useState(true);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  function switchAuthModeHandler() {
    setIsLoginUI((prevState) => !prevState);
  }

  async function submitHandler(event: any) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;

    if (isLoginUI) {
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      if (!result?.error) {
        router.replace("/");
      }
    }

    if (!isLoginUI && enteredEmail && enteredPassword) {
      try {
        const createResult = await createUser(enteredEmail, enteredPassword);
        console.log(createResult);
        const signinResult = await signIn("credentials", {
          redirect: false,
          email: enteredEmail,
          password: enteredPassword,
        });
        if (!signinResult?.error) {
          router.replace("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">
            {isLoginUI ? "Login" : "Sign Up"}
          </h3>
          <p className="text-sm text-gray-500">
            Create an account with your email and password
          </p>
        </div>
        <form
          onSubmit={submitHandler}
          className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
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
          <label
            htmlFor="password"
            className="block text-xs text-gray-600 uppercase"
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
          <div>
            <button className="border-black bg-black text-white hover:bg-white hover:text-black lex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none ">
              {isLoginUI ? "Login" : "Create Account"}
            </button>
            <div className="flex items-center justify-center space-x-2 pt-4">
              <button
                type="button"
                onClick={switchAuthModeHandler}
                className="text-center text-sm text-gray-600"
              >
                {isLoginUI ? "Create new account" : "Already have an account?"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
