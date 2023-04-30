import {
  affiliate_id,
  merchant_id,
} from "@/server/api/routers/affiliates/const";
import type { CreativeReportSchema } from "@/server/api/routers/affiliates/reports";
import { publicProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type RegType = {
  totalDemo: number;
  totalReal: number;
  total_leads: number;
};

type MerchantIds = {
  _sum?: {
    Impressions?: number;
    Clicks?: number;
  };
};

export const getCreativeReport = publicProcedure
  .input(
    z.object({
      from: z.date().optional(),
      to: z.date().optional(),
      banner_id: z.number().optional(),
      type: z.string().optional(),
      group_id: z.number().optional(),
    })
  )
  .query(async ({ ctx, input: { from, to, banner_id, group_id, type } }) => {
    const creativeArray = {};
    let creatives_stats_where = Prisma.empty;

    if (merchant_id) {
      creatives_stats_where = Prisma.sql`AND MerchantID=${merchant_id}`;
    }

    if (banner_id) {
      creatives_stats_where = Prisma.sql` AND BannerID=${banner_id} `;
    }

    const ww = await ctx.prisma.$queryRaw<
      z.infer<typeof CreativeReportSchema>[]
    >(
      Prisma.sql`SELECT CONCAT(Date,MerchantID,AffiliateID,BannerID) as id, MerchantID as merchant_id, AffiliateID as affiliate_id, SUM(Impressions) AS totalViews, SUM(Clicks) AS totalClicks, BannerID as banner_id
                        FROM merchants_creative_stats WHERE (Date BETWEEN  ${from}  AND ${to} ) ${creatives_stats_where} GROUP BY BannerID`
    );

    const merchants = await ctx.prisma.merchants.findMany({
      where: {
        valid: 1,
        id: Number(merchant_id),
      },
    });

    const bannersww = await ctx.prisma.merchants_creative.findMany({
      select: {
        id: true,
        title: true,
        merchant_id: true,
        type: true,
        width: true,
        height: true,
        merchant: {
          select: {
            name: true,
          },
        },
        language: {
          select: {
            title: true,
          },
        },
      },
      where: {
        merchant_id: merchant_id,
        valid: 1,
        affiliate_id: affiliate_id,
      },
    });

    const trafficRow = await ctx.prisma.merchants_creative_stats.groupBy({
      by: ["BannerID"],
      _sum: {
        Impressions: true,
        Clicks: true,
      },
    });

    const regww = await ctx.prisma.data_reg.findMany({
      include: {
        merchant: {
          select: {
            name: true,
          },
        },
      },
      where: {
        merchant_id: {
          gt: 0,
        },
        rdate: {
          gte: from,
          lte: to,
        },
        banner_id: banner_id ? banner_id : undefined,
        group_id: group_id ? group_id : undefined,
      },
    });

    for (const item of regww) {
      const creativeItems = {
        demo: 0,
        leads: 0,
        totalLeads: 0,
        totalDemo: 0,
        totalReal: 0,
        ftd: 0,
        totalCPI: 0,
        ftd_amount: 0,
        depositingAccounts: 0,
        sumDeposits: 0,
        bonus: 0,
        cpaAmount: 0,
        withdrawal: 0,
        chargeback: 0,
        volume: 0,
        lots: 0,
        totalCom: 0,
        real_ftd: 0,
        real_ftd_amount: 0,
        real: 0,
      };
      switch (item.type) {
        case "demo":
          creativeItems.demo += 1;
          break;
        case "lead":
          creativeItems.leads += 1;

        case "real":
          creativeItems.real += 1;
      }
    }

    //   const result: Record<string, any>[] = regww as RegType[];

    //   if (result && Object.keys(result).length > 0) {
    //     let _index = 0;
    //     while (_index <= Object.keys(result).length) {
    //       totalDemo = result[_index]?.total_demo || 0;
    //       totalReal = result[_index]?.total_real || 0;
    //       totalLeads = result[_index]?.total_leads || 0;
    //       _index++;
    //     }
    //   }

    //   reg = regww;

    //   const ids: MerchantIds[] = ww as MerchantIds[];

    //   totalImpresssions += ids[i]?._sum?.Impressions ?? 0;
    //   totalClicks += ids[i]?._sum?.Clicks ?? 0;
    //   totalDemoAccounts += totalDemo;
    //   totalRealAccounts += totalReal;
    //   totalLeadAccounts += totalLeads;
    //   totalFTD += ftd;
    //   totalCPIM += totalCPI;
    //   totalRealFTD += real_ftd;
    //   totalRealFTDAmount += real_ftd_amount;
    //   totalDeposits += depositingAccounts;
    //   totalFTDAmount += ftd_amount;
    //   totalSumPNL += totalPNL;
    //   totalDepositAmount += sumDeposits;
    //   totalVolume += volume;
    //   totalBonusAmount += bonus;
    //   totalWithdrawalAmount += withdrawal;
    //   totalChargeBackAmount + chargeback;

    //   i++;
    // }

    const merged: any = [];

    // for (let i = 0; i < ww.length; i++) {
    //   merged.push({
    //     ...ww[i],
    //     ...merchants[0],
    //     ...reg[i],
    //     ...bannerInfo[0],
    //   });
    // }

    // console.log("merged ----->", bannerInfo);

    return merged as Array<Record<string, any>>;
  });
