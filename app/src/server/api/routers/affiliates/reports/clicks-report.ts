import {
  ReportTraderDataItemSchema,
  getReportTraderData,
} from "@/server/api/routers/affiliates/reports/get-trader-data";
import {
  PageParamsSchema,
  exportType,
  getPageOffset,
  pageInfo,
  splitToPages,
} from "@/server/api/routers/affiliates/reports/reports-utils";
import { protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { trafficModel } from "../../../../../../prisma/zod";
import { merchant_id } from "../const";
import { checkIsUser } from "@/server/api/utils";

const Input = z.object({
  from: z.date(),
  to: z.date(),
  merchant_id: z.number().optional(),
  unique_id: z.string().optional(),
  trader_id: z.string().optional(),
  type: z.enum(["clicks", "views"]).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
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
    country: z.string().nullish(),
    banner_title: z.string().nullish(),
    banner_url: z.string().nullish(),
    merchant_name: z.string().nullish(),
    affiliate_name: z.string().nullish(),
    profile_name: z.string().nullish(),
  });

const clickReportResultSchema = z.object({
  data: z.array(ClickReportItem),
  pageInfo,
  totals: z.any(),
});

const clicksReport = async (
  prisma: PrismaClient,
  affiliate_id: number,
  {
    from,
    to,
    unique_id,
    trader_id,
    type,
    pageParams,
    sortBy,
    sortOrder,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const offset = getPageOffset(pageParams);
  const uid: string[] = [];

  console.log("clicksReport: Input Parameters", {
    from,
    to,
    unique_id,
    trader_id,
    type,
    pageParams,
    sortBy,
    sortOrder,
  });

  let type_filter = {};

  if (type === "views") {
    type_filter = {
      views: {
        gte: 0,
      },
    };
  } else if (type === "clicks") {
    type_filter = {
      clicks: {
        gte: 0,
      },
    };
  }

  let sortBy_new = {};
  let orderBy = {};
  if (sortBy && sortBy !== "") {
    if (sortBy == "affiliate_username") {
      sortBy_new = "af.username";
    } else if (sortBy == "merchant_name") {
      sortBy_new = "m.name";
    } else if (sortBy == "trader_id" || sortBy == "trader_alias") {
      sortBy_new = "";
    } else {
      (sortBy_new = ""), sortBy;
    }

    if (sortOrder && sortOrder != "") {
      if (sortBy_new !== "") {
        orderBy = { sortBy_new: sortOrder };
      }
    } else {
      if (sortBy_new !== "") orderBy = { sortBy_new: "asc" };
    }
  } else {
    sortBy_new = {
      id: "desc",
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

  // DONE missing order by and limits

  console.log("clicksReport: Filter and Order Parameters", {
    type_filter,
    orderBy,
    where: {
      ...type_filter,
      affiliate_id,
      merchant_id: merchant_id,
      uid: unique_id,
      rdate: {
        gte: from,
        lte: to,
      },
    },
  });

  const traficDataFull = await prisma.traffic.findMany({
    orderBy: orderBy,
    skip: offset,
    take: pageParams.pageSize,
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

  console.log("clicksReport: Traffic Data", {
    len: traficDataFull.length,
    traficDataFull: traficDataFull.slice(0, 10),
  });

  const totalRecords = await prisma.traffic.aggregate({
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

  console.log(`clicksReport:findMany`, {
    totalRecords,
    traficDataFull: traficDataFull.length,
    orderBy: orderBy,
    skip: offset,
    take: pageParams.pageSize,
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

  const ReportTradersDataItems = await getReportTraderData(prisma, from, uid);

  console.log("clicksReport:Report Trader Data (first 10 items)", {
    ReportTradersDataItems: Object.fromEntries(
      Object.entries(ReportTradersDataItems).slice(0, 10)
    ),
  });

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
      country: country?.title,
      banner_title: merchant_creative?.title,
      banner_url: merchant_creative?.url,
      merchant_name: merchant?.name,
      affiliate_name: affiliate?.username,
      profile_name: affiliates_profiles?.name,
      ...traderData,
    };
  });
  // DONE, this is not efficient for this report, need to use db side pagination
  return splitToPages(clickArray, pageParams);
};

export const getClicksReport = protectedProcedure
  .input(InputWithPageInfo)
  .output(clickReportResultSchema)
  .query(({ ctx, input }) => {
    const affiliate_id = checkIsUser(ctx);
    return clicksReport(ctx.prisma, affiliate_id, input);
  });

export const exportClicksReport = protectedProcedure
  .input(Input.extend({ exportType }))
  .mutation(async function ({ ctx, input }) {
    const affiliate_id = checkIsUser(ctx);
    const { exportType, ...params } = input;

    const columns = [
      "ID",
      "UID",
      "Impression",
      "Click",
      "Date",
      "Type",
      "Merchant",
      "Banner ID",
      "Profile ID",
      "Param",
      "Param 2",
      "Refer URL",
      "Country",
      "IP",
      "Platform",
      "Operating System",
      "OS Version",
      "Browser",
      "Browser Version",
      "Trader ID",
      "Trader Alias",
      "Lead",
      "Demo",
      "Sales Status",
      "Accounts",
      "FTD",
      "Volume",
      "Withdrawal Amount",
      "ChargeBack Amount",
      "Active Traders",
    ];

    // const file_date = new Date().toISOString();
    // const generic_filename = `clicks-report${file_date}`;
    //
    // console.log("export type ---->", exportType);
    // const clicks_report = "clicks-report";
    //
    // await exportReportLoop(
    //   exportType || "csv",
    //   columns,
    //   generic_filename,
    //   clicks_report,
    //   async (pageNumber, pageSize) =>
    //     clicksReport(ctx.prisma, {
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
