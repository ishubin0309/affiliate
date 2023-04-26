import { sub } from "date-fns";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { affiliate_id, merchant_id } from "./const";

export const getDashboardDeviceReport = publicProcedure
  .input(
    z.object({
      lastDays: z.number().int(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { lastDays } = input;
    const dateQuery = sub(new Date(), { days: lastDays ? lastDays : 0 });
    const data = await ctx.prisma.traffic.groupBy({
      by: ["platform"],
      where: {
        merchant_id: merchant_id ? merchant_id : 1,
        affiliate_id,
        rdate: {
          gte: dateQuery,
        },
      },
      _sum: {
        views: true,
        clicks: true,
      },
    });

    return data;
  });
