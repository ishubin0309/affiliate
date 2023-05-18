import { affiliate_id } from "@/server/api/routers/affiliates/const";
import { publicProcedure } from "@/server/api/trpc";
import type { PrismaClient, data_sales_type } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { LandingPageReportSchema } from "../reports";
import {
  PageParamsSchema,
  SortingParamSchema,
  getPageOffset,
  pageInfo,
} from "./reports-utils";

const LandingPageReportResultSchema = z.object({
  data: z.array(LandingPageReportSchema),
  pageInfo,
  totals: z.any(),
});

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  merchant_id: z.number().optional(),
  url: z.string().optional(),
  creative_type: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

export const landingPageData = async (
  prisma: PrismaClient,
  {
    from,
    to,
    merchant_id,
    url,
    creative_type,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  let totalLeads = 0;
  let totalDemo = 0;
  let totalReal = 0;
  let ftd = 0;
  let cpi = 0;
  let ftd_amount = 0;
  let real_ftd = 0;
  let real_ftd_amount = 0;
  let netRevenue = 0;
  let depositingAccounts = 0;
  let sumDeposits = 0;
  let bonus = 0;
  let chargeback = 0;
  let cpaAmount = 0;
  let withdrawal = 0;
  let volume = 0;
  let lots = 0;
  let totalPNL = 0;
  let depositsAmount = 0;
  let totalCom = 0;
  const offset = getPageOffset(pageParams);

  const orderBy = {};

  const bannersww = await prisma.merchants_creative.findMany({
    where: {
      merchant_id: merchant_id,
      valid: 1,
    },
    include: {
      language: {
        select: {
          title: true,
        },
      },
      merchant: {
        select: {
          name: true,
        },
      },
    },
    orderBy: orderBy,
    skip: offset,
    take: pageParams.pageSize,
  });

  //clicks and impressions
  const trafficRow = await prisma.traffic.groupBy({
    by: ["banner_id", "id"],
    _sum: {
      clicks: true,
      views: true,
    },
    where: {
      merchant_id: {
        gt: 0,
      },
      rdate: {
        gte: from,
        lt: to,
      },
    },
    orderBy: orderBy,
    skip: offset,
    take: pageParams.pageSize,
  });

  const regww = await prisma.data_reg.findMany({
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
        lt: to,
      },
    },
    orderBy: orderBy,
    skip: offset,
    take: pageParams.pageSize,
  });

  //Qualified

  const group_id = null;
  const trader_id = null;
  const selected_group_id = group_id
    ? Prisma.sql` and group_id = ${group_id}`
    : Prisma.empty;

  const FILTERbyTrader = trader_id
    ? Prisma.sql` and trader_id=  ${trader_id}`
    : Prisma.empty;

  const arrFtd = await prisma.$queryRaw(Prisma.sql`
			SELECT * FROM data_reg where type<>'demo' and FTDqualificationDate>'0000-00-00 00:00:00' and FTDqualificationDate >${from} and FTDqualificationDate < ${to} and affiliate_id = ${affiliate_id} and merchant_id = ${merchant_id}
			${selected_group_id}
			${FILTERbyTrader}
			`);

  interface SalesWWType {
    affiliate_id: number;
    merchant_id: number;
    initialftddate: string;
    rdate: Date;
    banner_id: number;
    trader_id: string;
    group_id: number;
    profile_id: number;
    amount: number;
    type: data_sales_type;
    country: string;
    tranz_id: number;
  }

  const banner_id = null;
  const cond_group_id = group_id
    ? Prisma.sql`AND tb1.group_id = ${group_id}`
    : Prisma.empty;

  const cond_banner_id = banner_id
    ? Prisma.sql` AND tb1.banner_id = ${banner_id}`
    : Prisma.empty;

  const cond_affiliate_id = affiliate_id
    ? Prisma.sql`AND tb1.affiliate_id = ${affiliate_id}`
    : Prisma.empty;

  const salesww = await prisma.$queryRaw<SalesWWType[]>`select * from (
			SELECT data_reg.merchant_id,data_reg.affiliate_id,data_reg.initialftddate,tb1.rdate,tb1.tranz_id,data_reg.banner_id,data_reg.trader_id,data_reg.group_id,data_reg.profile_id,tb1.amount, tb1.type AS data_sales_type  ,data_reg.country as country FROM data_sales as tb1 
					  INNER JOIN merchants_creative mc on mc.id= tb1.banner_id 
					 INNER JOIN data_reg AS data_reg ON tb1.merchant_id = data_reg.merchant_id AND tb1.trader_id = data_reg.trader_id AND data_reg.type <> 'demo'  
					 WHERE tb1.merchant_id> 0 and mc.valid=1 and tb1.rdate BETWEEN ${from} AND ${to}
					 ${cond_banner_id} ${cond_group_id} ${cond_affiliate_id}
					  ) a group by merchant_id , tranz_id , data_sales_type
`;

  const SalesArray = [];
  for (let i = 0; i < salesww.length; i++) {
    if (salesww[i]?.type === "bonus") {
      bonus = salesww[i]?.amount ?? 0;
      SalesArray.push({
        bonus: salesww[i]?.amount ?? 0,
      });
    }
    if (salesww[i]?.type === "withdrawal") {
      withdrawal = salesww[i]?.amount ?? 0;
      SalesArray.push({
        withdrawal: salesww[i]?.amount ?? 0,
      });
    }

    if (salesww[i]?.type === "chargeback") {
      chargeback = salesww[i]?.amount ?? 0;
      SalesArray.push({
        chargeback: salesww[i]?.amount ?? 0,
      });
    }

    if (salesww[i]?.type === "volume") {
      volume = salesww[i]?.amount ?? 0;
      SalesArray.push({
        volume: salesww[i]?.amount ?? 0,
      });
    }
  }

  const revww: any = await prisma.data_stats.findMany({
    select: {
      affiliate_id: true,
      banner_id: true,
      merchant_id: true,
      merchant: {
        select: {
          producttype: true,
          name: true,
        },
      },
      // data_reg: {
      // 	select: {
      // 		country: true,
      // 	},
      // },
    },
    where: {
      rdate: {
        gt: from,
        lt: to,
      },
      merchant_id: {
        gt: 0,
      },
      banner_id: banner_id ? banner_id : 0,
    },
    orderBy: orderBy,
    skip: offset,
    take: pageParams.pageSize,
  });

  const merchantww = await prisma.merchants.findMany({
    where: {
      producttype: "Forex",
      valid: 1,
    },
  });

  let traderStats: any[] = [];

  for (let i = 0; i < merchantww.length; i++) {
    const ts = await prisma.data_stats.groupBy({
      by: ["banner_id"],
      _sum: {
        spread: true,
        pnl: true,
        turnover: true,
      },
      where: {
        affiliate_id: affiliate_id,
        merchant_id: merchantww[i]?.id ? merchantww[i]?.id : 1,
        // banner_id: banner_id ? banner_id : 0,
        // group_id: group_id ? group_id : 0,
        rdate: {
          gt: from,
          lt: to,
        },
      },
    });
    traderStats = ts;
  }

  const creativeArray = [];
  const traffic: any = Object.values(trafficRow);
  for (let i = 0; i < bannersww.length; i++) {
    creativeArray.push({
      ...bannersww[i],
      ...traffic[i]._sum,
      ...regww[i],
      ...revww[i],
      ...SalesArray[i],
      volume: traderStats[i]?._sum?.turnover ?? 0,
      chargeback: chargeback,
      cpi: 0,
    });
  }

  console.log("creative array ---->", creativeArray);

  return {
    data: creativeArray,
    totals: {},
    pageInfo: {
      ...pageParams,
      totalItems: creativeArray.length,
    },
  };
};

export const getLandingPageData = publicProcedure
  .input(InputWithPageInfo)
  .output(LandingPageReportResultSchema)
  .query(({ ctx, input }) => landingPageData(ctx.prisma, input));
