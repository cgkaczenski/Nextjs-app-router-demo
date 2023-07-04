"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  function logoutHandler() {
    signOut();
  }

  return (
    <header className="sticky top-0 w-full shadow-md flex bg-slate-50 h-20 justify-between items-center px-12">
      <Link href="/" className="font-bold font-mono">
        Next.js Demo
      </Link>
      <nav className="flex space-x-4">
        {!session && (
          <section>
            <Link href="/auth" className="px-4">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              Get started today
            </Link>
          </section>
        )}
        {session && (
          <>
            <Link
              href="/dashboard"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              Profile
            </Link>
            <button
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
