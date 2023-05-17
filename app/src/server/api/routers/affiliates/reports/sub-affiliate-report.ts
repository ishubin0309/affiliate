import { affiliate_id } from "@/server/api/routers/affiliates/const";
import { publicProcedure } from "@/server/api/trpc";
import type { PrismaClient, affiliates } from "@prisma/client";
import { affiliatesModel } from "prisma/zod";
import { z } from "zod";
import {
  PageParamsSchema,
  SortingParamSchema,
  pageInfo,
} from "./reports-utils";

type DashboardType = {
  _sum?: {
    Clicks: number;
    Impressions: number;
    Leads: number;
    Demo: number;
    RealAccount: number;
    FTD: number;
    FTDAmount: number;
    Deposits: number;
    DepositsAmount: number;
    Bonus: number;
    Withdrawal: number;
    ChargeBack: number;
    PNL: number;
    Install: number;
    Commission: number;
    Volume: number;
  };
};

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  user_level: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

const SubAffiliateReportSchema = z.object({
  data: z.array(affiliatesModel),
  pageInfo,
  totals: z.any(),
});

export const subAffiliateReport = async (
  prisma: PrismaClient,
  {
    from,
    to,
    user_level,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  let viewsSum = 0;
  let clicksSum = 0;
  let totalLeads = 0;
  let totalDemo = 0;
  let totalReal = 0;
  let totalCPI = 0;
  let newFTD = 0;
  let ftdAmount = 0;
  let totalBonus = 0;
  let totalWithdrawal = 0;
  let totalChargeback = 0;
  const totalSumLots = 0;
  let totalCommission = 0;
  let totalPNL = 0;
  let total_deposits = 0;
  let total_depositsAmount = 0;
  const group_id = 0;
  let totalLots = 0;
  let totalVolume = 0;
  const merchantArray: Record<string, object> = {};

  const mer_rsc = await prisma.merchants.findMany({
    where: {
      valid: 1,
    },
  });

  let displayForex;
  for (let index = 0; index < Object.keys(mer_rsc).length; index++) {
    if (mer_rsc[index]?.producttype === "forex") {
      displayForex = 1;
    }
  }

  let allAffiliates;
  let affiliateData;

  const id = await prisma.affiliates.findMany({
    distinct: ["refer_id"],
    select: {
      refer_id: true,
    },
    where: {
      NOT: {
        refer_id: 0,
      },
    },
  });

  console.log("user level 1111 3333----->", id);

  if (user_level === "admin") {
    allAffiliates = await prisma.affiliates.findMany({
      where: {
        valid: 1,
      },
    });
  } else if (user_level === "manager") {
    allAffiliates = await prisma.affiliates.findMany({
      where: {
        valid: 1,
        group_id: user_level === "manager" ? group_id : 0,
      },
    });
  } else {
    allAffiliates = [];
  }

  // affiliate data

  if (user_level === "admin") {
    if (!affiliate_id) {
      affiliateData = await prisma.affiliates.findMany({
        where: {
          id: id[0]?.refer_id,
          valid: 1,
        },
      });
    } else {
      affiliateData = await prisma.affiliates.findMany({
        where: {
          id: id[0]?.refer_id,
          valid: 1,
          // OR: {
          //   id: Number(affiliate_id),
          //   refer_id: Number(affiliate_id),
          // },
        },
      });
    }
  } else if (user_level === "manager") {
    if (!affiliate_id) {
      affiliateData = await prisma.affiliates.findMany({
        where: {
          id: id[0]?.refer_id,
          valid: 1,
          group_id: user_level === "manager" ? group_id : 0,
        },
      });
    } else {
      affiliateData = await prisma.affiliates.findMany({
        where: {
          id: id[0]?.refer_id,
          valid: 1,
          group_id: user_level === "manager" ? group_id : 0,
          OR: {
            id: Number(affiliate_id),
            refer_id: Number(affiliate_id),
          },
        },
      });
    }
  } else {
    affiliateData = await prisma.affiliates.findMany({
      select: {
        username: true,
        id: true,
      },
      where: {
        valid: 1,
      },
    });
  }

  let data;
  let Commission;
  const affiliates = affiliateData as any;
  const IDs = await prisma.affiliates.findMany({
    select: {
      id: true,
    },
    take: 10,
  });
  if (user_level === "admin" || user_level === "manager") {
    for (let j = 0; j < IDs?.length; j++) {
      data = await prisma.dashboard.aggregate({
        _sum: {
          Clicks: true,
          Impressions: true,
          Leads: true,
          Demo: true,
          RealAccount: true,
          FTD: true,
          FTDAmount: true,
          Deposits: true,
          DepositsAmount: true,
          Bonus: true,
          Withdrawal: true,
          ChargeBack: true,
          PNL: true,
          Install: true,
          Commission: true,
          Volume: true,
        },
        where: {
          affiliate_id: IDs[j]?.id,
          Date: {
            gt: from,
            lt: to,
          },
        },
      });
    }
  } else {
    for (let i = 0; i < IDs?.length; i++) {
      Commission = await prisma.commissions.aggregate({
        _sum: {
          Commission: true,
        },
        where: {
          affiliate_id: IDs[i]?.id,
          Date: {
            gt: from,
            lt: to,
          },
        },
      });
    }
    for (let j = 0; j < affiliates?.length; j++) {
      data = prisma.dashboard.aggregate({
        _sum: {
          Clicks: true,
          Impressions: true,
          Leads: true,
          Demo: true,
          RealAccount: true,
          FTD: true,
          FTDAmount: true,
          Deposits: true,
          DepositsAmount: true,
          Bonus: true,
          Withdrawal: true,
          ChargeBack: true,
          PNL: true,
          Install: true,
          Commission: true,
          Volume: true,
        },
        where: {
          affiliate_id: affiliates[j]?.id,
          Date: {
            gt: from,
            lt: to,
          },
        },
      });

      Commission = await prisma.commissions.aggregate({
        _sum: {
          Commission: true,
        },
        where: {
          affiliate_id: affiliates[j]?.id,
          Date: {
            gt: from,
            lt: to,
          },
        },
      });
    }
  }

  const lots = await prisma.data_stats.findMany({
    select: {
      turnover: true,
      trader_id: true,
      rdate: true,
      affiliate_id: true,
      profile_id: true,
      banner_id: true,
    },
    where: {
      affiliate_id: affiliate_id,
      rdate: {
        gt: from,
        lt: to,
      },
    },
  });

  for (let i = 0; i < lots.length; i++) {
    totalLots += lots[i]?.turnover || 0;
  }

  const Data = data as DashboardType;
  for (let n = 0; n < Object.keys(Data)?.length; n++) {
    viewsSum += Data?._sum?.Impressions || 0;
    clicksSum += Data?._sum?.Clicks || 0;
    totalLeads += Data?._sum?.Leads || 0;
    totalCPI += Data?._sum?.Install || 0;
    totalDemo += Data?._sum?.Demo || 0;
    totalReal += Data?._sum?.RealAccount || 0;
    newFTD += Data?._sum?.FTD || 0;
    total_deposits += Data?._sum?.Deposits || 0;
    total_depositsAmount += Data?._sum?.DepositsAmount || 0;
    ftdAmount += Data?._sum?.FTDAmount || 0;
    totalBonus += Data?._sum?.Bonus || 0;
    totalWithdrawal += Data?._sum?.Withdrawal || 0;
    totalChargeback += Data?._sum?.ChargeBack || 0;
    totalPNL += Data?._sum?.Clicks || 0;
    totalCommission += Data?._sum?.Commission || 0;
    totalVolume += Data?._sum?.Volume || 0;
  }

  const subAffiliateArray = affiliates?.map((item: affiliates) => {
    return {
      ...item,
      ...Data,
    };
  });

  const arrRes = {
    data: subAffiliateArray,
    totals: {
      viewsSum,
      clicksSum,
      totalLots,
      totalCommission,
      totalBonus,
      totalPNL,
      totalChargeback,
      totalVolume,
      total_depositsAmount,
      totalReal,
      totalLeads,
      total_deposits,
      totalCPI,
      totalDemo,
      totalWithdrawal,
    },
    pageInfo: {
      ...pageParams,
      totalItems: subAffiliateArray.length,
    },
  };

  return arrRes;
};

export const getSubAffiliateReport = publicProcedure
  .input(InputWithPageInfo)
  .output(SubAffiliateReportSchema)
  .query(({ ctx, input }) => subAffiliateReport(ctx.prisma, input));
