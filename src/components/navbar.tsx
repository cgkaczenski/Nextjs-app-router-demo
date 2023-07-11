"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import clsx from "clsx";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isUnauthenticated = status === "unauthenticated";
  const [isOpen, setIsOpen] = useState(false);

  function logoutHandler() {
    setIsOpen(false);
    signOut();
  }

  const buttonClasses =
    "rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75";

  return (
    <header className="top-0 w-full shadow-md flex bg-slate-50 h-20 justify-between items-center px-4 sm:px-12">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-bold font-mono">
          Next.js Demo
        </Link>
      </div>
      {session && (
        <div>
          <Link
            href="/dashboard"
            className={clsx(buttonClasses, "hidden sm:block ")}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
        </div>
      )}
      <div>
        {!session && isUnauthenticated && (
          <section className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/auth" className="px-4">
              Sign in
            </Link>
            <Link href="/register" className={buttonClasses}>
              Get started today
            </Link>
          </section>
        )}
        {session && (
          <div>
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                <path
                  fillRule="evenodd"
                  d="M4 5h12a1 1 0 010 2H4a1 1 0 110-2zm0 6h12a1 1 0 010 2H4a1 1 0 110-2zm0 6h12a1 1 0 010 2H4a1 1 0 110-2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <nav
              className={clsx(
                "absolute right-0 flex flex-col items-start top-full mt-[-5px] w-auto bg-slate-50 shadow-md  space-y-4 p-4 rounded",
                { hidden: !isOpen }
              )}
            >
              <>
                <Link
                  href="/dashboard"
                  className={clsx(buttonClasses, "sm:hidden")}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className={buttonClasses}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button className={buttonClasses} onClick={logoutHandler}>
                  Logout
                </button>
              </>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
