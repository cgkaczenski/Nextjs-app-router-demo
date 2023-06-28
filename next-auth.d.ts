import "next-auth/jwt";

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth" {
  interface User {
    /** The user's role. */
    isVerified: boolean;
  }
}
