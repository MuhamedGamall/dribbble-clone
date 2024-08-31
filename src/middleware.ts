export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/profile(.*)",
    "/(create-project.*)",
    "/(update-project.*)",
    "/project(.*)",
    "/favorites(.*)",
    "/following(.*)",
  ],
};
