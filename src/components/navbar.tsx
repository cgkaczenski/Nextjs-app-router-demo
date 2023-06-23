"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Disclosure } from "@headlessui/react";
import VerifyBanner from "./verify-banner";
import { useState, useEffect } from "react";
import { User } from "../../next-auth";

export default function Navbar() {
  const [isBannerShowing, setIsBannerShowing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { data: session } = useSession();

  function logoutHandler() {
    signOut();
  }

  function closeHandler() {
    setIsBannerShowing(false);
  }

  useEffect(() => {
    if (session && session.user) {
      const user = session.user as User;
      setIsVerified(user.isVerified);
      if (!isVerified) {
        setIsBannerShowing(true);
      } else {
        setIsBannerShowing(false);
      }
    }
  }, [session, isVerified]);

  return (
    <header className="sticky top-0 w-full shadow-md flex bg-slate-50 h-20 justify-between items-center px-12">
      <Link href="/">
        <div className="font-bold font-mono">Next.js Demo</div>
      </Link>
      {isBannerShowing && <VerifyBanner onClickHandler={closeHandler} />}
      <nav>
        <Disclosure as="nav" className="flex space-x-4">
          {!session && (
            <section>
              <Link href="/auth" className="px-4">
                Sign in
              </Link>
              <Disclosure.Button
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                href={"/register"}
                as={Link}
              >
                Get started today
              </Disclosure.Button>
            </section>
          )}
          {session && (
            <Disclosure.Button
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              href={"/profile"}
              as={Link}
            >
              Profile
            </Disclosure.Button>
          )}
          {session && (
            <Disclosure.Button
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
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
