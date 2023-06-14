const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        secret: process.env.NEXTAUTH_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    };
  }

  return {
    env: {
      secret: process.env.NEXTAUTH_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  };
};
