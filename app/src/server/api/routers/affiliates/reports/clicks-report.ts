import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { affiliate_id, merchant_id } from "../const";
import { pageParams, reportParams } from "./reports-utils";
import { getReportTraderData } from "@/server/api/routers/affiliates/reports/get-trader-data";

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
  .output(output)
  .query(async ({ ctx, input: { from, to, unique_id, trader_id, type } }) => {
    const uid: string[] = [];
    let type_filter = {};

    if (type === "views") {
      type_filter = {
        views: {
          gt: 0,
        },
      };
    }

    if (type === "clicks") {
      type_filter = {
        clicks: {
          gt: 0,
        },
      };
    }

    // "SELECT * from traffic
    // WHERE ".$where . $type_filter ." AND
    // traffic.merchant_id > 0".
    // (!empty($unique_id) ? ' and traffic.uid = ' . $unique_id :'')." and
    // traffic.rdate >= '".$from."' AND
    // traffic.rdate <='".$to. "' ".
    // $orderBy ."
    // limit " . $start_limit. ", " . $end_limit;

    const traficDataFull = await ctx.prisma.traffic.findMany({
      where: {
        ...type_filter,
        affiliate_id: affiliate_id,
        merchant_id: merchant_id,
        uid: unique_id,
        rdate: {
          gte: from,
          lte: to,
        },
      },
      select: {
        id: true,
        uid: true,
        clicks: true,
        views: true,
        rdate: true,
        profile_id: true,
        type: true,
        banner_id: true,
        param: true,
        param2: true,
        param3: true,
        param4: true,
        param5: true,
        refer_url: true,
        ip: true,
        affiliate_id: true,
        platform: true,
        os: true,
        osVersion: true,
        browser: true,
        broswerVersion: true,
        merchant_id: true,
        country: {
          select: {
            title: true,
            code: true,
            id: true,
          },
        },
        merchant: {
          select: {
            id: true,
            name: true,
          },
        },
        affiliate: {
          select: {
            id: true,
            username: true,
          },
        },
        merchant_creative: {
          select: {
            id: true,
            title: true,
            url: true,
          },
        },
      },
    });

    for (const item of traficDataFull) {
      uid.push(item.uid);
    }

    const totalRecords = await ctx.prisma.traffic.aggregate({
      _count: {
        id: true,
      },
      where: {
        ...type_filter,
        affiliate_id: affiliate_id,
        merchant_id: merchant_id,
        uid: unique_id,
        rdate: {
          gte: from,
          lte: to,
        },
      },
    });

    const ReportTradersDataItems = await getReportTraderData(
      ctx.prisma,
      from,
      uid
    );

    const clickArray = traficDataFull.map((item) => {
      const {
        uid,
        banner_id,
        merchant_id,
        affiliate_id,
        rdate,
        country,
        merchant,
        affiliate,
        merchant_creative,
        ...restItem
      } = item;
      const traderData = ReportTradersDataItems[uid] || {};

      return {
        ...restItem,
        traffic_date: rdate,
        country: country.title,
        banner_title: merchant_creative.title,
        banner_url: merchant_creative.url,
        merchant_name: merchant.name,
        affiliate_username: affiliate.username,
        ...traderData,
      };
    });

    return clickArray;
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
