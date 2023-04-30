import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { translateModel } from "../../../../../../prisma/zod";

export const getTranslateReportFake = publicProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
      search: z.string().optional(),
    })
  )
  .output(z.array(translateModel))
  .query(async ({ ctx, input: { from, to, search } }) => {
    const { prisma } = ctx;

    return prisma.translate.findMany({ take: 10 });
  });
