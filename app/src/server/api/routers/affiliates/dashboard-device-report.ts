import { publicProcedure } from "../../trpc";
import { affiliate_id, merchant_id } from "./const";

export const getDashboardDeviceReport = publicProcedure.query(
  async ({ ctx }) => {
    const data = await ctx.prisma.merchants_creative_stats.groupBy({
      by: ["CountryID"],
      where: {
        merchant_id: merchant_id ? merchant_id : 1,
        affiliate_id,
      },
      _sum: {
        Clicks: true,
      },
    });

    return data;
  }
);
