import { publicProcedure } from "@/server/api/trpc";

export const sampleQuery = publicProcedure.query(async () => {
  return Promise.resolve({
    hello: "world",
  });
});
