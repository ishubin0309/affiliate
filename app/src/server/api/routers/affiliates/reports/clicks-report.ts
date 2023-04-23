import {
  affiliate_id,
  merchant_id,
} from "@/server/api/routers/affiliates/const";
import { publicProcedure } from "@/server/api/trpc";
import { Prisma, type data_sales_type } from "@prisma/client";
import { getUnixTime } from "date-fns";
import { z } from "zod";
import { pageParams, reportParams } from "./reports-utils";

const params = z.object({
  from: z.date(),
  to: z.date(),
  merchant_id: z.number().optional(),
  unique_id: z.string().optional(),
  trader_id: z.string().optional(),
  type: z.enum(["clicks", "views"]).optional(),
});

const Merchant = z.object({
  name: z.string(),
});

const Affiliate = z.object({
  username: z.string(),
});

const output = z.array(
  z.object({
    id: z.number().optional(),
    rdate: z.date().optional(),
    unixRdate: z.number().optional(),
    ctag: z.string().optional(),
    uid: z.string().optional(),
    ip: z.string().optional(),
    admin_id: z.number().optional(),
    affiliate_id: z.number().optional(),
    group_id: z.number().optional(),
    banner_id: z.number().optional(),
    merchant_id: z.number().optional(),
    profile_id: z.number().optional(),
    language_id: z.number().optional(),
    promotion_id: z.number().optional(),
    valid: z.boolean().optional(),
    title: z.string().optional(),
    bannerType: z.string().optional(),
    type: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    file: z.string().optional(),
    url: z.string().optional(),
    alt: z.string().optional(),
    platform: z.string().optional(),
    os: z.string().optional(),
    osVersion: z.string().optional(),
    browser: z.string().optional(),
    broswerVersion: z.string().optional(),
    userAgent: z.string().optional(),
    country_id: z.string().optional(),
    refer_url: z.string().optional(),
    param: z.string().optional(),
    param2: z.string().optional(),
    param3: z.string().optional(),
    param4: z.string().optional(),
    param5: z.string().optional(),
    views: z.number().optional(),
    clicks: z.number().optional(),
    product_id: z.number().optional(),
    merchant: Merchant.optional(),
    affiliate: Affiliate.optional(),
    trader_id2: z.string().optional(),
    trader_alias: z.string().optional(),
    sales_status: z.string().optional(),
  })
);

const paramsWithPage = params.extend(pageParams);
const paramsWithReport = params.extend(reportParams);

type InputType = z.infer<typeof paramsWithPage>;
type OutputType = z.infer<typeof output>;

export const getClicksReport = publicProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
      unique_id: z.string().optional(),
      trader_id: z.string().optional(),
      type: z.enum(["clicks", "views"]).optional(),
    })
  )
  .query(async ({ ctx, input: { from, to, unique_id, trader_id, type } }) => {
    // let offset;
    // if (page && items_per_page) {
    //   offset = (page - 1) * items_per_page;
    // }
    type TypeFilter = {
      clicks?: {
        gt: number;
      };
      views?: {
        gt: number;
      };
    };

    const clickArray: any = {};

    const getTypeFilter = (type?: "clicks" | "views"): TypeFilter => {
      if (type === "clicks" || type === "views") {
        return { [type]: { gt: 0 } };
      }
      return {};
    };

    const listProfiles = await ctx.prisma.affiliates_profiles.findMany({
      where: { valid: 1, affiliate_id: affiliate_id },
      select: { name: true, id: true },
    });

    const getTotalRecords = await ctx.prisma.traffic.aggregate({
      where: {
        ...getTypeFilter(type),
        AND: { uid: unique_id || "" },
        merchant_id: { gt: 0 },
        unixRdate: {
          gte: getUnixTime(from),
          lt: getUnixTime(to),
        },
      },
      _count: {
        id: true,
      },
    });

    const getClickWW = await ctx.prisma.traffic.findMany({
      where: {
        ...getTypeFilter(type),
        unixRdate: {
          gte: getUnixTime(from),
          lt: getUnixTime(to),
        },
        affiliate_id: affiliate_id,
        merchant_id: merchant_id,
      },
      include: {
        merchant: { select: { name: true } },
        affiliate: { select: { username: true } },
      },
    });

    const list_profiles = listProfiles;
    const totalRecords = getTotalRecords;
    const clickww = getClickWW;
    // const regArr = [];

    const l = 0;
    const totalLeads = 0;
    const totalDemo = 0;
    const totalReal = 0;
    const ftd = 0;
    const ftd_amount = 0;
    let real_ftd = 0;
    const real_ftd_amount = 0;
    const netRevenue = 0;
    const cpaAmount = 0;
    const lots = 0;
    const depositsAmount = 0;
    const totalCom = 0;
    let leads = 0;
    let demo = 0;
    let real = 0;

    for (const item of clickww) {
      const id = item.id;
      const row = item;

      if (id) {
        if (!clickArray[id]) {
          clickArray[id] = {};
        }

        clickArray[id].id = row.id;
        clickArray[id].admin_id = row.admin_id;
        clickArray[id].affiliate = row.affiliate;
        clickArray[id].affiliate_id = row.affiliate_id;
        clickArray[id].alt = row.alt;
        clickArray[id].bannerType = row.bannerType;
        clickArray[id].banner_id = row.banner_id;
        clickArray[id].broswerVersion = row.broswerVersion;
        clickArray[id].browser = row.browser;
        clickArray[id].clicks = row.clicks;
        clickArray[id].views = row.views;
        clickArray[id].country_id = row.country_id;
        clickArray[id].ctag = row.ctag;
        clickArray[id].file = row.file;
        clickArray[id].group_id = row.group_id;
        clickArray[id].height = row.height;
        clickArray[id].width = row.width;
        clickArray[id].ip = row.ip;
        clickArray[id].language_id = row.language_id;
        clickArray[id].merchant = row.merchant;
        clickArray[id].merchant_id = row.merchant_id;
        clickArray[id].os = row.os;
        clickArray[id].osVersion = row.osVersion;
        clickArray[id].param = row.param;
        clickArray[id].param2 = row.param2;
        clickArray[id].param3 = row.param3;
        clickArray[id].param4 = row.param4;
        clickArray[id].param5 = row.param5;
        clickArray[id].platform = row.platform;
        clickArray[id].product_id = row.product_id;
        clickArray[id].profile_id = row.profile_id;
        clickArray[id].promotion_id = row.promotion_id;
        clickArray[id].rdate = row.rdate;
        clickArray[id].unixRdate = row.unixRdate;
        clickArray[id].refer_url = row.refer_url;
        clickArray[id].title = row.title;
        clickArray[id].type = row.type;
        clickArray[id].uid = row.uid;
        clickArray[id].url = row.url;
        clickArray[id].userAgent = row.userAgent;
        clickArray[id].valid = row.valid;
      }

      if (Number(item?.uid) > 0) {
        const reggResult = await ctx.prisma.data_reg.findMany({
          where: {
            merchant_id: {
              gt: 0,
            },
            affiliate_id: affiliate_id,
            rdate: {
              gte: item?.rdate,
            },
            // uid: clickww[key]?.uid,
          },
        });

        const regg = reggResult;

        for (const reg_item of regg) {
          clickArray[id].rdate = reg_item.rdate;
          clickArray[id].trader_id = reg_item.trader_id;
          clickArray[id].trader_name = reg_item.trader_alias;
          clickArray[id].sales_status = reg_item.saleStatus;

          if (reg_item.type === "lead") {
            leads += 1;
            clickArray[id].leads = leads;
          }
          if (reg_item.type === "demo") {
            demo += 1;
            clickArray[id].demo = demo;
          }
          if (reg_item.type === "real") {
            real += 1;
            clickArray[id].real = real;
          }
        }

        const arrFtds = await ctx.prisma.data_reg.findMany({
          include: {
            data_sales: {
              select: {
                amount: true,
                rdate: true,
                id: true,
              },
            },
          },
        });

        for (const ftd_item of arrFtds) {
          real_ftd++;
          const real_ftd_amount = ftd_item.data_sales?.amount;
          clickArray[id].real_ftd = real_ftd;
          clickArray[id].real_ftd_amount = real_ftd_amount;
          clickArray[id].ftd_amount = ftd_amount;
          clickArray[id].ftd = ftd;
        }
      }

      console.log("clicks array ----->", clickArray);

      /*
              $sql = "SELECT data_reg.affiliate_id,data_reg.merchant_id,data_reg.initialftddate,tb1.rdate,data_reg.banner_id,data_reg.trader_id,data_reg.profile_id,tb1.amount, tb1.type AS data_sales_type  ,data_reg.country as country
              FROM data_sales as tb1 "

                       . "INNER JOIN data_reg AS data_reg ON
                       tb1.merchant_id = data_reg.merchant_id AND
                       tb1.trader_id = data_reg.trader_id AND
                       data_reg.type <> 'demo'  "
                       . "WHERE  tb1.trader_id = " .  $looped_trader_id
                      . " and tb1.rdate >= '" . $regDate . "'"
                      . " and tb1.merchant_id >0 "
                      . (empty($group_id) ? '' : ' AND tb1.group_id = ' . $group_id . ' ')
                       . (!empty($affiliate_id) ? ' and tb1.affiliate_id = ' . $affiliate_id :' ')
                       . (isset($banner_id) && !empty($banner_id) ? ' AND data_reg.banner_id = "'.$banner_id.'"' :' ')
                       .(!empty($unique_id) ? ' and data_reg.uid = ' . $unique_id :' ');

             */

      interface SalesWWType {
        affiliate_id: number;
        merchant_id: number;
        initialftddate: string;
        rdate: Date;
        banner_id: number;
        trader_id: string;
        profile_id: number;
        amount: number;
        type: data_sales_type;
        country: string;
      }

      const group_id = null;
      const cond_group_id = group_id
        ? Prisma.sql`AND tb1.group_id = ${group_id}`
        : Prisma.empty;

      const cond_unique_id = unique_id
        ? Prisma.sql`AND data_reg.uid = ${unique_id}`
        : Prisma.empty;

      const salesww = await ctx.prisma.$queryRaw<SalesWWType[]>`SELECT
           data_reg.affiliate_id,
           data_reg.merchant_id,
           data_reg.initialftddate,
           tb1.rdate,
           data_reg.banner_id,
           data_reg.trader_id,
           data_reg.profile_id,
           tb1.amount,
           tb1.type         AS data_sales_type ,
           data_reg.country AS country
FROM       data_sales       AS tb1
INNER JOIN data_reg         AS data_reg
ON         tb1.merchant_id = data_reg.merchant_id
AND        tb1.trader_id = data_reg.trader_id
AND        data_reg.type <> 'demo'
WHERE      tb1.trader_id = ${trader_id}
AND        tb1.rdate >= ${from}
AND        tb1.merchant_id >0
${cond_group_id}
${cond_unique_id}
`;
      // (empty($group_id) ? '' : ' AND tb1.group_id = ' . $group_id . ' ')                 . (!empty($affiliate_id) ? ' and tb1.affiliate_id = ' . $affiliate_id :' ')                 . (isset($banner_id) && !empty($banner_id) ? ' AND data_reg.banner_id = "'.$banner_id.'"' :' ')
      // .(!empty($unique_id) ? ' and data_reg.uid = ' . $unique_id :' ');`;

      /**
       * uncomment the include statement below to recreate the issue.
       */
      // const salesww = await ctx.prisma.data_sales.findMany({
      //   include: {
      //     data_reg: {
      //       select: {
      //         affiliate_id: true,
      //         initialftdtranzid: true,
      //         banner_id: true,
      //         trader_id: true,
      //         country: true,
      //         profile_id: true,
      //       },
      //     },
      //   },
      //   where: {
      //     affiliate_id: affiliate_id,
      //     merchant_id: {
      //       gt: 0,
      //     },
      //   },
      //   take: 10,
      // });

      // 		const salesww = await ctx.prisma
      // 			.$queryRaw(Prisma.sql`SELECT data_reg.affiliate_id,data_reg.merchant_id,data_reg.initialftddate,tb1.rdate,data_reg.banner_id,data_reg.trader_id,data_reg.profile_id,tb1.amount, tb1.type AS data_sales_type  ,data_reg.country as country FROM data_sales as tb1

      //   INNER JOIN data_reg AS data_reg ON tb1.merchant_id = data_reg.merchant_id AND tb1.trader_id = data_reg.trader_id AND data_reg.type = 'demo'
      //   WHERE tb1.merchant_id > 0`);
      const bonus = 0;
      const volume = 0;
      const chargeback = 0;
      const withdrawal = 0;
      let depositingAccounts = 0;
      const sumDeposits = 0;
      const balance_sheet = [];

      for (const sales_item of salesww) {
        if (Number(sales_item?.type) === 1 || sales_item.type === "deposit") {
          depositingAccounts++;
          clickArray[id].depositingAccounts = depositingAccounts;
          clickArray[id].sumDeposits += sales_item.amount;
        }
        if (sales_item.type === "bonus") {
          clickArray[id].bonus += sales_item.amount;
        }
        if (sales_item.type === "withdrawal") {
          clickArray[id].withdrawal += sales_item.amount;
        }
        if (sales_item.type === "chargeback") {
          clickArray[id].chargeback += sales_item.amount;
        }
        if (sales_item.type === "volume") {
          clickArray[id].volume += sales_item.amount;
        }
      }

      // for (let i = 0; i < salesww.length; i++) {
      //   if (salesww[i]?.type === "deposit") {
      //     depositingAccounts += 1;
      //     sumDeposits += salesww[i]?.amount || 0;
      //   }
      //   if (salesww[i]?.type === "bonus") {
      //     bonus += salesww[i]?.amount || 0;
      //   }

      //   if (salesww[i]?.type === "withdrawal") {
      //     withdrawal += salesww[i]?.amount || 0;
      //   }

      //   if (salesww[i]?.type === "volume") {
      //     volume += salesww[i]?.amount || 0;
      //   }

      //   if (salesww[i]?.type === "chargeback") {
      //     chargeback += salesww[i]?.amount || 0;
      //   }

      //   balance_sheet.push({
      //     volume,
      //     bonus,
      //     chargeback,
      //     withdrawal,
      //   });
      // }

      const revww = await ctx.prisma.data_stats.findMany({
        include: {
          merchant: {
            select: {
              producttype: true,
            },
          },
        },
      });

      const type_filter = {};
      let intTotalRevenue = 0;

      for (const item of revww) {
        if (item.merchant.producttype === "casino") {
          const getStatic = await ctx.prisma.data_stats.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              type: "static",
            },
          });

          const bets = await ctx.prisma.data_stats.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              type: "bets",
            },
          });
          const wins = await ctx.prisma.data_stats.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              type: "wins",
            },
          });
          const jackpot = await ctx.prisma.data_stats.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              type: "jackpot",
            },
          });
          const bonuses = await ctx.prisma.data_stats.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              type: "bonuses",
            },
          });
          const removed_bonuses = await ctx.prisma.data_stats.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              type: "removed_bonuses",
            },
          });

          if (!bets._sum.amount) bets._sum.amount = 0;
          if (!wins._sum.amount) wins._sum.amount = 0;
          if (!jackpot._sum.amount) jackpot._sum.amount = 0;
          if (!bonuses._sum.amount) bonuses._sum.amount = 0;
          if (!removed_bonuses._sum.amount) removed_bonuses._sum.amount = 0;

          intTotalRevenue =
            getStatic?._sum.amount ||
            0 +
              bets?._sum.amount -
              wins?._sum.amount -
              jackpot?._sum.amount -
              bonuses?._sum.amount +
              removed_bonuses?._sum.amount;
        }

        if (item.merchant.producttype === "sportsbetting") {
          const netRevenue = await ctx.prisma
            .$queryRaw(Prisma.sql`SELECT SUM(amount) FROM (SELECT trader_id, type, 
									IF(
									(type=10 OR type=12),
									SUM(amount),
									(IF((type=13 OR type=11 OR type=15),(SUM(amount)*-1),0))) as amount
					FROM data_stats  GROUP BY trader_id,type 

					UNION ALL 
								   
					SELECT trader_id, type, 
								   IF((type = 10 OR type=12 OR type=6), (SUM(amount)*-1), 0) as amount
					FROM data_sales  GROUP BY trader_id,type
								  
					)t1`);

          intTotalRevenue = netRevenue;
        }
        let netRevenue = 0;
        netRevenue += Number(intTotalRevenue);
        clickArray[id].netRevenue += netRevenue;

        // const merchantww = await ctx.prisma.merchants.findMany({
        //   where: {
        //     producttype: "Forex",
        //     valid: 1,
        //   },
        // });

        const ts = await ctx.prisma.data_stats.aggregate({
          _sum: {
            spread: true,
            pnl: true,
            turnover: true,
          },
          where: {
            rdate: {
              gte: item.rdate,
            },
            group_id: Number(group_id),
            affiliate_id: affiliate_id,
            merchant_id: row.merchant_id,
          },
        });

        let volume = 0;
        volume += ts?._sum?.turnover || 0;
        clickArray[id].volume = volume;
      }

      // const merged: OutputType = [];

      // for (let i = 0; i < clickww?.length; i++) {
      //   merged.push({
      //     ...clickww[i],
      //     ...regArr[i],
      //     // ...balance_sheet[i],
      //   });
      // }

      // console.log("merged ------>", merged.length);
    }
    return Object.values(clickArray);
  });

// export const getClicksReport = publicProcedure
//   .input(paramsWithPage)
//   .output(output)
//   .query(clicksReport);

// export const exportClicksReport = publicProcedure
//   .input(paramsWithReport)
//   .mutation(async function ({ ctx, input }) {
//     const { exportType, ...params } = input;

//     const columns = [
//       "ID",
//       "UID",
//       "Impression",
//       "Click",
//       "Date",
//       "Type",
//       "Merchant",
//       "Banner ID",
//       "Profile ID",
//       "Param",
//       "Param 2",
//       "Refer URL",
//       "Country",
//       "IP",
//       "Platform",
//       "Operating System",
//       "OS Version",
//       "Browser",
//       "Browser Version",
//       "Trader ID",
//       "Trader Alias",
//       "Lead",
//       "Demo",
//       "Sales Status",
//       "Accounts",
//       "FTD",
//       "Volume",
//       "Withdrawal Amount",
//       "ChargeBack Amount",
//       "Active Traders",
//     ];

//     const file_date = new Date().toISOString();
//     const generic_filename = `clicks-report${file_date}`;

//     console.log("export type ---->", exportType);
//     const clicks_report = "clicks-report";

//     await exportReportLoop(
//       exportType || "csv",
//       columns,
//       generic_filename,
//       clicks_report,
//       async (page, items_per_page) =>
//         clicksReport({
//           ctx,
//           input: { ...params, page, items_per_page },
//         })
//     );

//     const bucketName = "reports-download-tmp";
//     const serviceKey = path.join(
//       __dirname,
//       "../../../../../api-front-dashbord-a4ee8aec074c.json"
//     );

//     const public_url = uploadFile(
//       serviceKey,
//       "api-front-dashbord",
//       bucketName,
//       generic_filename,
//       exportType ? exportType : "json"
//     );
//     return public_url;
//   });
