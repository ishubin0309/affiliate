import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { affiliate_id, merchant_id } from "../const";
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
  .output(output)
  .query(async ({ ctx, input: { from, to, unique_id, trader_id, type } }) => {
    const data: any = {};
    const uid: string[] = [];
    let type_filter = {};
    const clickArray: any = {};
    const MerchantsCreativeDataItems: any = {};
    const AffiliatesDataItems: any = {};
    const ReportTradersDataItems: any = {};
    const MerchantsDataItems: any = {};

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
      include: {
        country: {
          select: {
            title: true,
            code: true,
            id: true,
          },
        },
      },
    });

    // console.log("traffic full data ----->", traficDataFull);

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

    const MerchantsData = await ctx.prisma.merchants.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    for (const merchant of MerchantsData) {
      const id = merchant.id;
      MerchantsDataItems[id] = {};
      MerchantsDataItems[id].id = merchant.id;
      MerchantsDataItems[id].name = merchant.name;
    }

    const MerchantsCreativeData = await ctx.prisma.merchants_creative.findMany({
      select: {
        id: true,
        title: true,
        url: true,
      },
    });
    // console.log("merchant creative data ----->", MerchantsCreativeData);

    for (const item of MerchantsCreativeData) {
      const id = item?.id;
      MerchantsCreativeDataItems[id] = {};
      MerchantsCreativeDataItems[id].id = item.id;
      MerchantsCreativeDataItems[id].title = item.title;
      MerchantsCreativeDataItems[id].url = item.url;
    }

    const AffiliatesData = await ctx.prisma.affiliates.findMany({
      select: {
        id: true,
        username: true,
      },
    });

    for (const item of AffiliatesData) {
      const id = item?.id;
      AffiliatesDataItems[id] = {};
      AffiliatesDataItems[id].id = item.id;
      AffiliatesDataItems[id].username = item.username;
    }

    const ReportTradersData = await ctx.prisma.reporttraders.findMany({
      where: {
        Date: {
          gte: from,
        },
        ClickDetails: {
          in: uid,
        },
      },
    });
    let lead = 0;
    let demo = 0;
    let real = 0;

    for (const row of ReportTradersData) {
      ReportTradersDataItems[row.ClickDetails] = {};
      ReportTradersDataItems[row.ClickDetails].volume = row.Volume;
      ReportTradersDataItems[row.ClickDetails].trader_id = row.TraderID;
      ReportTradersDataItems[row.ClickDetails].trader_name = row.TraderAlias;
      ReportTradersDataItems[row.ClickDetails].FirstDeposit = row.FirstDeposit;
      ReportTradersDataItems[row.ClickDetails].TotalDeposits =
        row.TotalDeposits;
      ReportTradersDataItems[row.ClickDetails].DepositAmount =
        row.DepositAmount;
      ReportTradersDataItems[row.ClickDetails].BonusAmount = row.BonusAmount;
      ReportTradersDataItems[row.ClickDetails].WithdrawalAmount =
        row.WithdrawalAmount;
      ReportTradersDataItems[row.ClickDetails].ChargeBackAmount =
        row.ChargeBackAmount;
      ReportTradersDataItems[row.ClickDetails].NetDeposit = row.NetDeposit;
      ReportTradersDataItems[row.ClickDetails].PNL = row.PNL;
      ReportTradersDataItems[row.ClickDetails].Commission = row.Commission;
      switch (row.Type) {
        case "lead":
          lead += 1;
          ReportTradersDataItems[row.ClickDetails].lead = lead;
          break;

        case "demo":
          demo += 1;
          ReportTradersDataItems[row.ClickDetails].demo = demo;
          break;

        case "real":
          real += 1;
          ReportTradersDataItems[row.ClickDetails].real = real;
          break;
      }

      if (
        Number(row.TotalDeposits) > 0 ||
        Number(row.Volume) > 0 ||
        Number(row.PNL) > 0
      ) {
        let QFTD = 0;
        QFTD += 1;
        ReportTradersDataItems[row.ClickDetails].QFTD = QFTD;
      }
    }

    for (const item of traficDataFull) {
      const id = item.id;
      clickArray[id] = {};
      clickArray[id].id = item.id;
      clickArray[id].uid = item.uid;
      clickArray[id].clicks = item.clicks;
      clickArray[id].views = item.views;
      clickArray[id].traffic_date = item.rdate;
      clickArray[id].profile_id = item.profile_id;
      clickArray[id].type = item.type;
      clickArray[id].banner_id = item.banner_id;
      clickArray[id].param = item.param;
      clickArray[id].param2 = item.param2;
      clickArray[id].param3 = item.param3;
      clickArray[id].param4 = item.param4;
      clickArray[id].param5 = item.param5;
      clickArray[id].refer_url = item.refer_url;
      clickArray[id].country = item.country.title;
      clickArray[id].ip = item.ip;
      clickArray[id].affiliate_id = item.affiliate_id;
      clickArray[id].platform = item.platform;
      clickArray[id].os = item.os;
      clickArray[id].osVersion = item.osVersion;
      clickArray[id].browser = item.browser;
      clickArray[id].broswerVersion = item.broswerVersion;
      clickArray[id].banner_title =
        MerchantsCreativeDataItems[item.banner_id].title;
      clickArray[id].banner_url =
        MerchantsCreativeDataItems[item.banner_id].url;
      clickArray[id].merchant_name = MerchantsDataItems[item.merchant_id].name;
      clickArray[id].affiliate_username =
        AffiliatesDataItems[item.affiliate_id].username;
      clickArray[id].volume = ReportTradersDataItems[item?.uid]?.volume;
      clickArray[id].trader_id = ReportTradersDataItems[item?.uid]?.trader_id;
      clickArray[id].trader_name =
        ReportTradersDataItems[item?.uid]?.trader_name;
      clickArray[id].lead = ReportTradersDataItems[item?.uid]?.lead;
      clickArray[id].demo = ReportTradersDataItems[item?.uid]?.demo;
      clickArray[id].real = ReportTradersDataItems[item?.uid]?.real;
      clickArray[id].sales_status =
        ReportTradersDataItems[item?.uid]?.sales_status;
      clickArray[id].ftd_amount = ReportTradersDataItems[item?.uid]?.ftd_amount;
      clickArray[id].ftd = ReportTradersDataItems[item?.uid]?.ftd;
      clickArray[id].depositingAccounts =
        ReportTradersDataItems[item?.uid]?.depositingAccounts;
      clickArray[id].sumDeposits =
        ReportTradersDataItems[item?.uid]?.sumDeposits;
      clickArray[id].bonus = ReportTradersDataItems[item?.uid]?.bonus;
      clickArray[id].withdrawal = ReportTradersDataItems[item?.uid]?.withdrawal;
      clickArray[id].chargeback = ReportTradersDataItems[item?.uid]?.chargeback;
      clickArray[id].netRevenue = ReportTradersDataItems[item?.uid]?.netRevenue;
      clickArray[id].pnl = ReportTradersDataItems[item?.uid]?.pnl;
      clickArray[id].QFTD = ReportTradersDataItems[item?.uid]?.QFTD;
      clickArray[id].totalCom = ReportTradersDataItems[item?.uid]?.totalCom;
    }

    console.log(
      "merchant creative data items ---->",
      Object.values(clickArray)[0]
    );

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
