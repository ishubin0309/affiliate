import { protectedProcedure } from "@/server/api/trpc";

export const sampleQuery = protectedProcedure.query(async () => {
  return Promise.resolve({
    hello: "world",
  });
});
