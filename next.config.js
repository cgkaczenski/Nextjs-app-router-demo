const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        secret: process.env.NEXTAUTH_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        BASE_URL: process.env.BASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
      },
    };
  }

  return {
    env: {
      secret: process.env.NEXTAUTH_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      BASE_URL: "https://" + process.env.NEXT_PUBLIC_VERCEL_URL,
      JWT_SECRET: process.env.JWT_SECRET,
    },
  };
};
