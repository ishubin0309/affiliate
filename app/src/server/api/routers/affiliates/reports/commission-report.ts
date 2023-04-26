import { affiliate_id } from "@/server/api/routers/affiliates/const";
import { publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import type { Simplify } from "@trpc/server";
import path from "path";
import paginator from "prisma-paginate";
import { z } from "zod";
import { uploadFile } from "../config";
import { exportReportLoop, pageParams, reportParams } from "./reports-utils";

const params = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  commission: z.string().optional(),
  trader_id: z.string().optional(),
});

const paramsWithPage = params.extend(pageParams);
const paramsWithReport = params.extend(reportParams);

type InputType = z.infer<typeof paramsWithPage>;
const commissionSummary = async ({
  ctx,
  input: { from, to, trader_id, commission, page, items_per_page },
}: {
  ctx: Simplify<unknown>;
  input: InputType;
}) => {
  const prismaClient = new PrismaClient();
  const paginate = paginator(prismaClient);
  let offset;
  if (page && items_per_page) {
    offset = (page - 1) * items_per_page;
  }
  // }
  let deal_filter = {};
  switch (commission) {
    case "CPA":
      deal_filter = { DealType: "CPA" };
      break;

    case "NetDeposit":
      deal_filter = { DealType: "NetDeposit" };
      break;

    case "PNLRevShare":
      deal_filter = { DealType: "PNL RevShare" };

      break;
  }

  const data = await paginate.commissions.paginate({
    limit: items_per_page ? items_per_page : 10,
    page: page,
    orderBy: {
      Date: "asc",
    },
    where: {
      ...deal_filter,
      Date: {
        gte: from,
        lt: to,
      },
      affiliate_id: affiliate_id,
      traderID: trader_id ? trader_id : "",
    },
    include: {
      merchant: {
        select: {
          name: true,
        },
      },
      affiliate: {
        select: {
          username: true,
        },
      },
    },
  });

  console.log("commission report ----->", data);

  return data?.result;
};

export const getCommissionReport = publicProcedure
  .input(paramsWithPage)
  .query(commissionSummary);

export const exportCommissionReport = publicProcedure
  .input(paramsWithReport)
  .mutation(async function ({ ctx, input }) {
    const { exportType, ...params } = input;

    const columns = [
      "Merchant Name",
      "Merchant ID",
      "Trader ID",
      "Transaction ID",
      "Type",
      "Amount",
      "Location",
      "Commission",
    ];

    const file_date = new Date().toISOString();
    const generic_filename = `commission-report${file_date}`;

    console.log("export type ---->", exportType);
    const commission_report = "commission-report";
    await exportReportLoop(
      exportType || "csv",
      columns,
      generic_filename,
      commission_report,
      async (page, items_per_page) =>
        commissionSummary({
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
