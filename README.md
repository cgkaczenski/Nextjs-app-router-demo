# Introduction

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

On May 4th 2023, Next.js 13.4 was released, marking stability for the App Router. You can read the blog post [here](https://nextjs.org/blog/next-13-4). This introduces the concept of server components! It seems the React and Next.js teams have been working closely together to push React components down to the server. You can read more about the concept in the [Next.js docs](https://nextjs.org/docs/getting-started/react-essentials#thinking-in-server-components) as well as in [this post](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) from the React team.

I am creating this repo as a learning demo, so I can learn this new mental model.

## Live demo

The live demo can be found [here](https://nextjs-app-router-demo.vercel.app/). The app has three pages for a home screen (unprotected), profile page for password change, and authform for signin and signup. I don't have guards for routes, database, auth, or server-side logic setup yet.

## Plan

I just want to learn how to do basic things using the app router. Adding done and todo sections at the bottom of this readme. To start, I'll just setup some basic auth with protected routes and user management. I notice that NextAuth has a (very) little [documentation](https://next-auth.js.org/configuration/initialization#route-handlers-app) about using [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/router-handlers) to get started. Another option is for getting started is [Supabase](https://supabase.com/docs/guides/auth/auth-helpers/nextjs#server-components). While I would like to use PostgreSQL hosted on Supabase or [Railway](https://railway.app), I am not sure if I want to sprinkle Supabase code throughout my app because I would like to make something that is not platform specific.

## Getting Started

First, create a new file in the root directory `.env`. It just needs one line `NEXTAUTH_SECRET=xxxxxx`. To generate the secret, NextAuth [recommends](https://next-auth.js.org/configuration/options#secret) using the command

```bash
openssl rand -base64 32
```

Next, run the development server:

```bash
npx next dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Don't forget to set an [environment variable](https://vercel.com/docs/concepts/projects/environment-variables) for `NEXTAUTH_SECRET` in your project.

### Done

- Basic pages, layouts, routes, and links

### In Progress

- Authentication
- Sessions
- Page guards

### Todo

- Route Handlers
- Database integration
- Sign in/ Sign up
- Password change
- Style
- Admin page
- Roles
- User management

### Things I've learned

- The root layout replaces the \_app.js and \_document.js files. View the [migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#migrating-_documentjs-and-_appjs).
- Route Handlers replace API Routes inside the pages directory meaning you do not need to use API Routes and Route Handlers together.
- Next Links now automatically include the `<a>` tag, but you should still use tag when you want to force a server request to check the session.
- Redirect function exists for redirecting in server components
- For user interactivity, a client component must be used. `"use client";` can be written at the top of a client component, then "sprinkled" into the server component
