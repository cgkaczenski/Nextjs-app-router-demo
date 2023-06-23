"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default async function UserVerificationPage({
  params,
}: {
  params: { userId: string; token: string };
}) {
  const { userId, token } = params;
  const { data: session } = useSession();
  const response = await fetch(process.env.BASE_URL + "/api/auth/signup", {
    method: "PATCH",
    body: JSON.stringify({
      userId: userId,
      token: token,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok && session) {
    // Sign out the user if they are signed in
    //, so they can sign in again with verified email
    signOut();
  }

  return (
    <div className="flex">
      {response.ok ? (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
          <div className="text-center max-w-screen-sm mb-10">
            <h1 className="font-bold ">Success!</h1>
            <p>You have successfully verified your account.</p>
            <p>
              Please click{" "}
              <Link href="/auth" className="text-blue-300">
                here{" "}
              </Link>
              to sign in to your verified account.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
          <div className="text-center max-w-screen-sm mb-10">
            <h1 className="font-bold ">Error!</h1>
            <p>
              We were unable to verifiy your account. Please contact support.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
