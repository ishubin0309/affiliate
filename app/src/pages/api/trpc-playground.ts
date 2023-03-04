// pages/api/trpc-playground.ts
import type { NextApiHandler } from "next";
import { appRouter } from "../../server/api/root";
import { nextHandler } from "trpc-playground/handlers/next";

const setupHandler = nextHandler({
  router: appRouter,
  // tRPC api path, pages/api/trpc/[trpc].ts in this case
  trpcApiEndpoint: "/api/trpc",
  playgroundEndpoint: "/api/trpc-playground",
  // uncomment this if you're using superjson
  request: {
    superjson: true,
  },
});

const handler: NextApiHandler = async (req, res) => {
  const playgroundHandler = await setupHandler;
  await playgroundHandler(req, res);
};

export default handler;
