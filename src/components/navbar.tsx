"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Disclosure } from "@headlessui/react";

export default function Navbar() {
  function logoutHandler() {
    signOut();
  }

  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <header className="w-full shadow-md flex bg-sky-50 h-20 justify-between items-center px-12">
      <Link href="/">
        <div className="font-mono">Next Auth</div>
      </Link>
      <nav>
        <Disclosure as="nav" className="flex space-x-4">
          {!session && !loading && (
            <Disclosure.Button
              className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              href={"/authform"}
              as={Link}
            >
              Login
            </Disclosure.Button>
          )}
          {session && (
            <Disclosure.Button
              className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              href={"/profile"}
              as={Link}
            >
              Profile
            </Disclosure.Button>
          )}
          {session && (
            <Disclosure.Button
              className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              onClick={logoutHandler}
            >
              Logout
            </Disclosure.Button>
          )}
        </Disclosure>
      </nav>
    </header>
  );
}
