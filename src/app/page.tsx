import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="text-center max-w-screen-sm mb-10">
          <h1 className="text-stone-200 font-bold  font-mono text-2xl">
            Next.js PostgreSQL Auth Demo
          </h1>
          <p className="text-stone-400 mt-5">
            This is a{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 underline hover:text-stone-200 transition-all"
            >
              Next.js
            </a>{" "}
            demo app that uses{" "}
            <a
              href="https://next-auth.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 underline hover:text-stone-200 transition-all"
            >
              Next-Auth
            </a>{" "}
            for email + password login and a{" "}
            <a
              href="https://supabase.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 underline hover:text-stone-200 transition-all"
            >
              Supabase PostgreSQL
            </a>{" "}
            database to persist the data.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/profile"
            prefetch={false} // workaround until https://github.com/vercel/vercel/pull/8978 is deployed
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            Protected Profile Page
          </Link>
          <p className="text-white">·</p>
          <a
            href="https://github.com/cgkaczenski/Nextjs-app-router-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
