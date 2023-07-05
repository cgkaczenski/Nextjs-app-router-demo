# Introduction

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

On May 4th 2023, Next.js 13.4 was released, marking stability for the App Router. You can read the blog post [here](https://nextjs.org/blog/next-13-4). You can read more about the concept in the [Next.js docs](https://nextjs.org/docs/getting-started/react-essentials#thinking-in-server-components) as well as in [this post](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) from the React team.

I am creating this repo as a learning demo, so I can learn this new mental model.

## Live demo

The live demo can be found [here](https://nextjs-app-router-demo.vercel.app/). The app has three pages for a home screen (unprotected), profile page for password change, and authform for signin and signup.

## Getting Started

First, create a new file in the root directory `.env`. NextAuth manages sessions and needs this one line `NEXTAUTH_SECRET=xxxxxx`. To generate the secret, NextAuth [recommends](https://next-auth.js.org/configuration/options#secret) using the command

```bash
openssl rand -base64 32
```

Next, add another line to the `.env` file `DATABASE_URL=xxxxxx`. I've tested this using [Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres) using the [Postgres.js](https://github.com/porsager/postgres) library, but it should work on any hosted Postgresql DB with an open port, so maybe I'll test it on [Railway](https://railway.app) soon. In Supabase, you can find the database url under the database's `Project Settings`, then go to `Connection string` and click the `URI` tab.

Finally, run the development server:

```bash
npx next dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Don't forget to set an [environment variable](https://vercel.com/docs/concepts/projects/environment-variables) for `NEXTAUTH_SECRET` and `DATABASE_URL` in your project.

### Done

- Basic pages, layouts, routes, and links
- Database integration
- Sign in/ Sign up
- Page guards
- Route Handlers
- Authentication
- Sessions
- Password change
- Navbar
- Sign out
- Style
- Toast Notifications
- Email integration
- Forgot password
- Email verification
- Welcome email

### In Progress

- Deactivate account

### Todo

- Config for dev vs production environments
- Roles
- Admin page
- User management

### Things I've learned

- The root layout replaces the \_app.js and \_document.js files. View the [migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#migrating-_documentjs-and-_appjs).
- Route Handlers replace API Routes inside the pages directory meaning you do not need to use API Routes and Route Handlers together.
- Redirect function exists for redirecting in server components
- For user interactivity, a client component must be used. `"use client";` can be written at the top of a client component, then "sprinkled" into the server component
- API routes are a little different in app router, instead called [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/router-handlers). They export function called GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS (which are the only supported HTTP Methods). If you want to return a response, need to import the NextResponse object.
- ReactJs Context Providers can be wrapped in the main layout.tsx file. For more information read [this](https://nextjs.org/docs/getting-started/react-essentials#context)
- Event handlers cannot be passed to Client Component props.
- [This](https://nextjs.org/docs/app/api-reference/file-conventions/page) is how you get url params in server components
- You can't use relative URLs from the server side
- [<Link>](https://nextjs.org/docs/app/api-reference/components/link) tags will be prefetched, which will cause a crash if you are loading data for a lot of links at once. This can be disabled using `prefetch={false}` prop
