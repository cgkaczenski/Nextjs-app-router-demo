"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const isUnauthenticated = status === "unauthenticated";
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  function logoutHandler() {
    signOut();
  }

  return (
    <header className="sticky top-0 w-full shadow-md flex bg-slate-50 h-20 justify-between items-center px-4 sm:px-12">
      <div className="relative flex h-16 items-center justify-between">
        <Link href="/" className="font-bold font-mono">
          Next.js Demo
        </Link>

        {session && (
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                className={classNames(
                  isDashboard ? "border-black" : "border-transparent",
                  "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-900"
                )}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
      <div>
        {!session && isUnauthenticated && (
          <section className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button>
                <span className="sr-only">Open user menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/dashboard"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700 sm:hidden"
                      )}
                    >
                      Dashboard
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      onClick={logoutHandler}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700 hover:cursor-pointer"
                      )}
                    >
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </header>
  );
}
