import { withAuth } from "next-auth/middleware";

export default withAuth({
  // callbacks: {
  //   authorized: ({ token }) => token?.role === "SuperAdmin" || token?.role === "Admin",
  // },
});

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
