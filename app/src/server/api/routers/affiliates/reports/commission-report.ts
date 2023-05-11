import { affiliate_id } from "@/server/api/routers/affiliates/const";
import { publicProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import path from "path";
import { z } from "zod";
import { uploadFile } from "../config";
import {
  exportReportLoop,
  exportType,
  getPageOffset,
  PageParamsSchema,
} from "./reports-utils";

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  commission: z.string().optional(),
  trader_id: z.string().optional(),
});

const InputWithPageInfo = Input.extend({ pageParams: PageParamsSchema });

const commissionSummary = async (
  prisma: PrismaClient,
  {
    from,
    to,
    trader_id,
    commission,
    pageParams,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const offset = getPageOffset(pageParams);

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

  const data = await prisma.commissions.findMany({
    take: pageParams.pageSize,
    skip: offset,
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

  return {
    data,
    // TODO
    totals: {},
    pageInfo: {
      ...pageParams,
      // TODO
      totalItems: 0,
    },
  };
};

export const getCommissionReport = publicProcedure
  .input(InputWithPageInfo)
  .query(({ ctx, input }) => commissionSummary(ctx.prisma, input));

export const exportCommissionReport = publicProcedure
  .input(Input.extend({ exportType }))
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
    const serviceKey = path.join(
      __dirname,
      "../../../../../api-front-dashbord-a4ee8aec074c.json"
    );
    await exportReportLoop(
      "api-front-dashbord",
      serviceKey,
      exportType || "csv",
      columns,
      commission_report,
      async (pageNumber, pageSize) =>
        commissionSummary(ctx.prisma, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    const bucketName = "reports-download-tmp";

    const public_url = uploadFile(
      serviceKey,
      "api-front-dashbord",
      bucketName,
      generic_filename,
      exportType ? exportType : "json"
    );
    return public_url;
  });
