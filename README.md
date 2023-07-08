# Introduction

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

On May 4th 2023, Next.js 13.4 was released, marking stability for the App Router. You can read the blog post [here](https://nextjs.org/blog/next-13-4). You can read more about the concept in the [Next.js docs](https://nextjs.org/docs/getting-started/react-essentials#thinking-in-server-components) as well as in [this post](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) from the React team.

I am creating this repo as a learning demo, so I can learn this new mental model.

## Live demo

The live demo can be found [here](https://nextjs-app-router-demo.vercel.app/).

## Getting Started - Local Development

First, create a new file in the root directory `.env`. I have provided a .env.template file you can use as a guide.

To generate the NEXTAUTH_SECRET, NextAuth [recommends](https://next-auth.js.org/configuration/options#secret) using the command

```bash
openssl rand -base64 32
```

You can use the same command to generate a JWT_SECRET as well.

For the DATABASE_URL, I've tested this using [Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres) using the [Postgres.js](https://github.com/porsager/postgres) library, but it should work on any hosted Postgresql DB with an open port. In Supabase, you can find the database url under the database's `Project Settings`, then go to `Connection string` and click the `URI` tab.

The SENDGRID_API_KEY, is found easily under `Settings` and `API Keys`. SendGrid Recommends use also navigate to `Sender Authentication` and authorize a single sender during development.

ADMIN_EMAIL is the email you want SendGrid to use when sending users registration or password reset emails. Keep in mind that the emails will all go to spam folder, unless you configure custom domain for your email.

BASE_URL can remain the same as in the template unless you are changing the port. If deploying to Vercel, the next.config.js file will automatically handle the production or staging base url configuration.

DATABASE_SSL_CERT is used to encrypt data that is passed back and forth from your hosted database. Supabase [recommends](https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-ssl) connecting with SSL. The application expects this to be encoded using base64. Once you have downloaded your SSL certificate from Supabase, you can use this command to encode the cert in base64:

```bash
openssl base64 -in /path/to/certificate.crt -out certificate_base64.txt
```

Finally, run the development server:

```bash
npx next dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Don't forget to set an [environment variable](https://vercel.com/docs/concepts/projects/environment-variables) for all the local enviroment variables as well (except BASE_URL).

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

- Data explorer dashboard

### Todo

- Org structure with schema
- Config for dev vs production environments
- Deactivate account
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
- [Link](https://nextjs.org/docs/app/api-reference/components/link) tags will be prefetched, which will cause a crash if you are loading data for a lot of links at once. This can be disabled using `prefetch={false}` prop
- Next.js does not automatically add CORS headers for same origin in app router api route handlers. This must be done manually.
- It is really bad to accidentally make a client component async! Appartently Next.js shipped a canary version of React that allows Client Components to be async, but if you use it you get an infinite loop. For more information, you can read [this](https://phryneas.de/react-server-components-controversy?ck_subscriber_id=1095131582)
- When a user manually reloads a page, it seems the server component will pass an empty object to the client component if you are fetching data in the server and passing it down as a prop. This will cause an error in the client component unless you write code to check that the prop is actually assigned a value. Even then, you will get a warning in the browser about hydration errors, so you have to check if the component has been mounted before you render anything. For more information you can read [this](https://nextjs.org/docs/messages/react-hydration-error) and [this](https://www.joshwcomeau.com/react/the-perils-of-rehydration/).
