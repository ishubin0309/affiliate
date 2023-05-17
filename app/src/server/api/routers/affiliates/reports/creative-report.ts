/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  affiliate_id,
  merchant_id,
} from "@/server/api/routers/affiliates/const";
import type { CreativeReportSchema } from "@/server/api/routers/affiliates/reports";
import {
  PageParamsSchema,
  exportReportLoop,
  exportType,
  getPageOffset,
  pageInfo,
} from "@/server/api/routers/affiliates/reports/reports-utils";
import { publicProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import path from "path";
import { data_statsModel } from "prisma/zod";
import { z } from "zod";
// import { uploadFile } from "../config";

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

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  banner_id: z.number().optional(),
  type: z.string().optional(),
  group_id: z.number().optional(),
});

const traderReportSchema = data_statsModel.extend({
  DataReg: z
    .object({
      saleStatus: z.string(),
      freeParam5: z.string(),
    })
    .optional(),
  affiliate: z.object({ group_id: z.number().optional() }).optional(),
  merchant: z.object({ merchant_id: z.number().optional() }).optional(),
});

const creativeReportTotalsSchema = z.object({
  totalFTD: z.number(),
  totalTotalDeposit: z.number(),
  totalDepositAmount: z.number(),
  totalVolumeAmount: z.number(),
  totalBonusAmount: z.number(),
  totalWithdrawalAmount: z.number(),
  totalChargeBackAmount: z.number(),
  totalNetRevenue: z.number(),
  totalTrades: z.number(),
  totalTotalCom: z.number(),
});

const InputWithPageInfo = Input.extend({ pageParams: PageParamsSchema });
const creativeReportResultSchema = z.object({
  data: z.array(traderReportSchema),
  pageInfo,
  totals: creativeReportTotalsSchema,
});

const creativeReport = async (
  prisma: PrismaClient,
  {
    from,
    to,
    banner_id,
    type,
    group_id,
    pageParams,
  }: z.infer<typeof InputWithPageInfo>
) => {
  console.log("pageParams", pageParams);
  const offset = getPageOffset(pageParams);

  let creatives_stats_where = Prisma.empty;
  const country = "";
  const trader_id = "";
  const profile_id = "";
  if (merchant_id) {
    creatives_stats_where = Prisma.sql`AND MerchantID=${merchant_id}`;
  }

  if (banner_id) {
    creatives_stats_where = Prisma.sql` AND BannerID=${banner_id} `;
  }

  const ww = await prisma.$queryRaw<z.infer<typeof CreativeReportSchema>[]>(
    Prisma.sql`SELECT CONCAT(Date,MerchantID,AffiliateID,BannerID) as id, MerchantID as merchant_id, AffiliateID as affiliate_id, SUM(Impressions) AS totalViews, SUM(Clicks) AS totalClicks, BannerID as banner_id
                        FROM merchants_creative_stats WHERE (Date BETWEEN  ${from}  AND ${to} ) ${creatives_stats_where} GROUP BY BannerID`
  );

  const merchants = await prisma.merchants.findMany({
    where: {
      valid: 1,
      id: Number(merchant_id),
    },
  });

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
  const bannersww = await prisma.merchants_creative.findMany({
    take: pageParams.pageSize,
    skip: offset,
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
    },
  });

  // console.log("banners ww -------->", bannersww);

  let where_main: any = {};

  if (merchant_id) {
    where_main = {
      merchant_id: merchant_id,
    };
  }
  if (banner_id) {
    where_main = {
      banner_id: banner_id,
    };
  }

  if (profile_id) {
    where_main = {
      profile_id: profile_id,
    };
  }

  if (country) {
    where_main = {
      country: country,
    };
  }

  const trafficRow = await prisma.merchants_creative_stats.groupBy({
    by: ["BannerID"],
    _sum: {
      Impressions: true,
      Clicks: true,
    },
    where: {
      ...where_main,
      Date: {
        gt: from,
        lt: to,
      },
    },
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
        lte: to,
      },
      banner_id: banner_id ? banner_id : undefined,
      group_id: group_id ? group_id : undefined,
    },
  });

  for (const item of regww) {
    switch (item.type) {
      case "demo":
        creativeItems.demo += 1;
        break;
      case "lead":
        creativeItems.leads += 1;

      case "real":
        // const totalTraffic = await prisma?.traffic.aggregate({

        // });
        creativeItems.real += 1;
    }
  }

  const traderIDs = await prisma.data_sales.findMany({
    select: {
      trader_id: true,
    },
    where: {
      type: "deposit",
      product_id: merchant_id,
    },
  });

  const arrRow = await prisma.data_sales.findMany({
    take: 10,
    select: {
      product_id: true,
      banner_id: true,
      amount: true,
      rdate: true,
      affiliate_id: true,
      trader_id: true,
      id: true,
      data_reg: {
        select: {
          country: true,
        },
      },
    },
    where: {
      ...where_main,
      type: "deposit",
      // IN: {
      //   trader_id: traderIDs,
      // },
    },
  });

  for (const item of arrRow) {
    const real_ftd_amount = item.amount;
    creativeItems.real_ftd += 1;
    creativeItems.real_ftd_amount += real_ftd_amount;
    creativeItems.ftd += 1;
    creativeItems.ftd_amount += real_ftd_amount;
  }

  let sales_filter = {};

  if (group_id) {
    sales_filter = {
      group_id: group_id,
    };
  }

  if (affiliate_id) {
    sales_filter = {
      affiliate_id: affiliate_id,
    };
  }

  if (banner_id) {
    sales_filter = {
      banner_id: banner_id,
    };
  }

  const salesww = await prisma.data_sales.findMany({
    select: {
      amount: true,
      type: true,
      data_reg: {
        select: {
          merchant_id: true,
          affiliate_id: true,
          banner_id: true,
          trader_id: true,
          group_id: true,
          profile_id: true,
          country: true,
        },
      },
    },
    where: {
      ...sales_filter,
      NOT: {
        type: "PNL",
      },
      merchant_id: {
        gt: 0,
      },
      rdate: {
        gte: from,
        lte: to,
      },
    },
  });

  for (const item of salesww) {
    if (item.type === "deposit") {
      creativeItems.depositingAccounts += 1;
      creativeItems.sumDeposits += item.amount;
    }

    if (item.type === "bonus") {
      creativeItems.bonus += item.amount;
    }

    if (item.type === "withdrawal") {
      creativeItems.withdrawal += item.amount;
    }

    if (item.type === "chargeback") {
      creativeItems.chargeback += item.amount;
    }

    if (item.type === "volume") {
      creativeItems.volume += item.amount;
    }
  }

  const revww = await prisma.data_stats.findMany({
    select: {
      affiliate_id: true,
      banner_id: true,
      merchant_id: true,
      merchant: {
        select: {
          producttype: true,
        },
      },
      // data_reg: {
      //   select: {
      //     country: true,
      //   },
      // },
    },
    distinct: ["affiliate_id", "banner_id", "merchant_id", "country"],
    where: {
      ...where_main,
      rdate: {
        gt: from,
        lt: to,
      },
    },
  });

  for (const item of merchants) {
    const ts = await prisma.data_stats.groupBy({
      by: ["banner_id"],
      _sum: {
        spread: true,
        turnover: true,
      },
      where: {
        ...where_main,
        AND: [
          {
            merchant_id: item.id,
          },
          {
            merchant_id: {
              gt: 0,
            },
          },
        ],
      },
    });

    for (const item of ts) {
      if (item.banner_id === 0) {
      }
      creativeItems.volume += item?._sum?.turnover || 0;
    }

    // const toww = await ctx.prisma.data_stats.findMany({
    //   select: {
    //     turnover: true,
    //     trader_id: true,
    //     rdate: true,
    //     affiliate_id: true,
    //     profile_id: true,
    //     banner_id: true,
    //     data_reg: {
    //       select: {
    //         country: true,
    //         initialftdtranzid: true,
    //       },
    //     },
    //   },
    //   where: {
    //     ...where_main,

    //     merchant_id: {
    //       AND: [
    //         {
    //           merchant_id: item.id,
    //         },
    //         {
    //           merchant_id: {
    //             gt: 0,
    //           },
    //         },
    //       ],
    //     },
    //   },
    // });
  }

  const creativeArray = bannersww?.map((item) => {
    const { merchant, language, ...resItem } = item;
    return {
      ...creativeItems,
      ...resItem,
      merchant_name: merchant.name,
      language: language.title,
    };
  });

  const arrRes = {
    data: creativeArray,
    totals: creativeItems,
    pageInfo: {
      ...pageParams,
      totalItems: creativeArray.length,
    },
  };

  return arrRes;
};

export const getCreativeReport = publicProcedure
  .input(InputWithPageInfo)
  .query(({ ctx, input }) => creativeReport(ctx.prisma, input));

export const exportTraderReport = publicProcedure
  .input(Input.extend({ exportType }))
  .mutation(async function ({ ctx, input }) {
    const { exportType, ...params } = input;

    const columns = [
      "Creative ID",
      "Creative Name",
      "Merchant",
      "Type",
      "Impressions",
      "Clicks",
      "Installation",
      "Click Through Ratio(CTR)",
      "Click To Account",
      "Click To Sale",
      "Leads",
      "Demo",
      "Accounts",
      "FTD",
      "Volume",
      "Withdrawal Amount",
      "ChargeBack Amount",
    ];

    // const file_date = new Date().toISOString();
    // const creative_report = "creative-report";
    // const generic_filename = `${creative_report}${file_date}`;
    //
    // // console.log("export type ---->", exportType);
    // await exportReportLoop(
    //   exportType || "csv",
    //   columns,
    //   generic_filename,
    //   creative_report,
    //   async (pageNumber, pageSize) =>
    //     creativeReport(ctx.prisma, {
    //       ...params,
    //       pageParams: { pageNumber, pageSize },
    //     })
    // );
    //
    // const bucketName = "reports-download-tmp";
    // const serviceKey = path.join(
    //   __dirname,
    //   "../../../../../api-front-dashbord-a4ee8aec074c.json"
    // );
    //
    // const public_url = uploadFile(
    //   serviceKey,
    //   "api-front-dashbord",
    //   bucketName,
    //   generic_filename,
    //   exportType ? exportType : "json"
    // );
    // return public_url;
    return Promise.resolve("");
  });
