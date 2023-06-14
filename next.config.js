const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        secret: process.env.NEXTAUTH_SECRET,
      },
    };
  }

  return {
    env: {
      secret: process.env.NEXTAUTH_SECRET,
    },
  };
};
