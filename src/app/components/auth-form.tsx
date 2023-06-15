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
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event: any) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });

      if (!result?.error) {
        router.replace("/");
      }

      console.log(result);
    }

    if (!isLogin && enteredEmail && enteredPassword) {
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
    <section>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required ref={emailInputRef} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required ref={passwordInputRef} />
        <div>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button type="button" onClick={switchAuthModeHandler}>
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}
