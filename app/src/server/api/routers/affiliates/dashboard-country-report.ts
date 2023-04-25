import { sub } from "date-fns";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { affiliate_id, merchant_id } from "./const";

export const getDashboardCountryReport = publicProcedure
  .input(
    z.object({
      lastDays: z.number().int(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { lastDays } = input;
    const dateQuery = sub(new Date(), { days: lastDays ? lastDays : 0 });
    const data = await ctx.prisma.merchants_creative_stats.groupBy({
      by: ["merchant_id", "CountryID"],
      where: {
        merchant_id: merchant_id ? merchant_id : 1,
        affiliate_id,
        Date: {
          gte: dateQuery,
        },
      },
      _sum: {
        Clicks: true,
        BannerID: true,
        Impressions: true,
      },
    });

    return data;
  });
