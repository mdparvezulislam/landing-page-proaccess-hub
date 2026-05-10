import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.email === "admin@proaccess.com",
  },
});

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
