import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { affiliate_id, merchant_id } from "../const";
import {
  getReportTraderData,
  ReportTraderDataItemSchema,
} from "@/server/api/routers/affiliates/reports/get-trader-data";
import { trafficModel } from "../../../../../../prisma/zod";
import {
  pageInfo,
  PageParamsSchema,
  splitToPages,
} from "@/server/api/routers/affiliates/reports/reports-utils";

const Input = z.object({
  from: z.date(),
  to: z.date(),
  merchant_id: z.number().optional(),
  unique_id: z.string().optional(),
  trader_id: z.string().optional(),
  type: z.enum(["clicks", "views"]).optional(),
});

const InputWithPageInfo = Input.extend({ pageParams: PageParamsSchema });

const ClickReportItem = trafficModel
  .pick({
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
  })
  .merge(ReportTraderDataItemSchema.partial())
  .extend({
    country: z.string(),
    banner_title: z.string(),
    banner_url: z.string(),
    merchant_name: z.string(),
    affiliate_name: z.string(),
    profile_name: z.string(),
  });

const clickReportResultSchema = z.object({
  data: z.array(ClickReportItem),
  pageInfo,
  totals: z.any(),
});

export const getClicksReport = publicProcedure
  .input(InputWithPageInfo)
  .output(clickReportResultSchema)
  .query(
    async ({
      ctx,
      input: { from, to, unique_id, trader_id, type, pageParams },
    }) => {
      const uid: string[] = [];
      let type_filter = {};

      if (type === "views") {
        type_filter = {
          views: {
            gt: 0,
          },
        };
      } else if (type === "clicks") {
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

      // TODO missing order by and limits
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
          affiliates_profiles: {
            select: {
              id: true,
              name: true,
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
          country,
          merchant,
          affiliate,
          merchant_creative,
          affiliates_profiles,
          ...restItem
        } = item;
        const traderData = ReportTradersDataItems[uid] || {};

        return {
          uid,
          banner_id,
          ...restItem,
          country: country.title,
          banner_title: merchant_creative.title,
          banner_url: merchant_creative.url,
          merchant_name: merchant.name,
          affiliate_name: affiliate.username,
          profile_name: affiliates_profiles.name,
          ...traderData,
        };
      });

      // TODO, this is not efficient for this report, need to use db side pagination
      return splitToPages(clickArray, pageParams);
    }
  );

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
