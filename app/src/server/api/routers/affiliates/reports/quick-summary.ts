import {
  affiliate_id,
  merchant_id,
} from "@/server/api/routers/affiliates/const";
import { QuickReportSummarySchema } from "@/server/api/routers/affiliates/reports";
import {
  exportReportLoop,
  pageParams,
  reportParams,
} from "@/server/api/routers/affiliates/reports/reports-utils";
import { publicProcedure } from "@/server/api/trpc";
import { convertPrismaResultsToNumbers } from "@/utils/prisma-convert";
import { Prisma, PrismaClient } from "@prisma/client";
import type { Simplify } from "@trpc/server";
import { formatISO } from "date-fns";
import path from "path";
import paginator from "prisma-paginate";
import { z } from "zod";
import { uploadFile } from "../config";
const QuickReportSummarySchemaArray = z.array(QuickReportSummarySchema);

const params = z.object({
  from: z.date(),
  to: z.date(),
  display: z.string().optional(),
  merchant_id: z.number().optional(),
});

const paramsWithPage = params.extend(pageParams);
const paramsWithReport = params.extend(reportParams);

type InputType = z.infer<typeof paramsWithPage>;

const quickReportSummary = async ({
  ctx,
  input: { from, to, display = "", page, items_per_page },
}: {
  ctx: Simplify<unknown>;
  input: InputType;
}) => {
  console.log(from, to);

  // TODO: no reason to use paginator, can use the prisma query directly as paginator does not support $queryRaw
  const prismaClient = new PrismaClient();
  const paginate = paginator(prismaClient);
  console.log("display type", display, merchant_id);

  let offset;
  if (page && items_per_page) {
    offset = (page - 1) * items_per_page;
  }
  let dasboardSQLperiod = Prisma.sql`GROUP BY d.MerchantId ORDER BY d.MerchantId ASC`;
  let dasboardSQLwhere = Prisma.empty;

  if (display === "monthly") {
    dasboardSQLperiod = Prisma.sql`GROUP BY d.MerchantId, YEAR(d.Date), MONTH(d.Date) ORDER BY YEAR(d.Date) ASC, MONTH(d.Date) ASC, d.MerchantId ASC`;
  }

  if (display === "weekly") {
    dasboardSQLperiod = Prisma.sql`GROUP BY d.MerchantId, YEAR(d.Date), WEEK(d.Date,1) ORDER BY YEAR(d.Date) ASC, WEEK(d.Date,1) ASC, d.MerchantId ASC`;
  }

  if (display === "daily") {
    dasboardSQLperiod = Prisma.sql`GROUP BY d.MerchantId, d.Date ORDER BY d.Date ASC, d.MerchantId ASC`;
  }

  if (merchant_id) {
    dasboardSQLwhere = Prisma.sql` AND d.MerchantId = '${merchant_id}`;
  }

  if (affiliate_id) {
    dasboardSQLwhere = Prisma.sql` AND d.AffiliateID = ${affiliate_id}`;
  }

  // dasboardSQLwhere = Prisma.sql` LIMIT ${offset}, ${items_per_page}`;

  const data = await paginate.$queryRaw<
    z.infer<typeof QuickReportSummarySchema>[]
  >(Prisma.sql`select
        d.Date,
        d.MerchantId AS merchant_id,
        YEAR(d.Date) AS Year,
        MONTH(d.Date) AS Month ,
        WEEK(d.Date) AS Week,
        sum(d.Impressions) as Impressions,
        sum(d.Clicks) as Clicks,
        sum(d.Install) as Install,
        sum(d.Leads) as Leads,
        sum(d.Demo) as Demo,
        sum(d.RealAccount) as RealAccount,
        sum(d.FTD) as FTD,
        sum(d.FTDAmount) as FTDAmount,
        sum(d.RawFTD) as RawFTD,
        sum(d.RawFTDAmount) as RawFTDAmount,
        sum(d.Deposits) as Deposits,
        sum(d.DepositsAmount) as DepositsAmount,
        sum(d.Bonus) as Bonus,
        sum(d.Withdrawal) as Withdrawal,
        sum(d.ChargeBack) as ChargeBack,
        sum(d.NetDeposit) as NetDeposit,
        sum(d.PNL) as PNL,
        sum(d.Volume) as Volume,
        sum(d.ActiveTrader) as ActiveTrader,
        sum(d.Commission) as Commission,
        sum(d.PendingDeposits) as PendingDeposits,
        sum(d.PendingDepositsAmount) as PendingDepositsAmount
        from Dashboard d
        INNER JOIN affiliates aff ON d.AffiliateID = aff.id
        WHERE
          d.Date >= ${formatISO(from, { representation: "date" })}
        AND d.Date <  ${formatISO(to, {
          representation: "date",
        })} ${dasboardSQLwhere}  ${dasboardSQLperiod}  LIMIT ${offset}, ${items_per_page}`);

  // console.log("quick report data ----->", data);

  return data?.map(convertPrismaResultsToNumbers) || data;
};

export const getQuickReportSummary = publicProcedure
  .input(paramsWithPage)
  .output(QuickReportSummarySchemaArray)
  .query(quickReportSummary);

export const exportQuickSummaryReport = publicProcedure
  .input(paramsWithReport)
  .mutation(async function ({ ctx, input }) {
    const items_per_page = 5000;
    const { exportType, ...params } = input;

    const columns = [
      "Impressions",
      "Clicks",
      "Install",
      "Leads",
      "Demo",
      "Real Account",
      "FTD",
      "Withdrawal",
      "ChargeBack",
      "Active Trader",
      "Commission",
    ];
    const file_date = new Date().toISOString();
    const generic_filename = `quick-summary${file_date}`;

    console.log("export type ---->", exportType);
    const quick_summary = "quick-summary";

    await exportReportLoop(
      exportType || "csv",
      columns,
      generic_filename,
      quick_summary,
      async (page, items_per_page) =>
        quickReportSummary({
          ctx,
          input: { ...params, page, items_per_page },
        })
    );

    const bucketName = "reports-download-tmp";
    const serviceKey = path.join(
      __dirname,
      "../../../../../api-front-dashbord-a4ee8aec074c.json"
    );

    const public_url = uploadFile(
      serviceKey,
      "api-front-dashbord",
      bucketName,
      generic_filename,
      exportType ? exportType : "json"
    );
    return public_url;
  });
