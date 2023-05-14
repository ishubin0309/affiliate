import { withAuth } from "next-auth/middleware";

const middleware = withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req: any) {
    console.log("###: middleware", req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token }: any) => {
        console.log(`###: muly:authorized`, { token });
        return !!token;
      },
    },
  }
);

export default middleware;

export const config = { matcher: ["/affiliates/(.*)", "/"] };
