import { protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import type { Simplify } from "@trpc/server";
import path from "path";
import paginator from "prisma-paginate";
import { z } from "zod";
import {
  exportReportLoop,
  exportType,
  getPageOffset,
  PageParamsSchema,
} from "./reports-utils";
import { checkIsUser } from "@/server/api/utils";

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  commission: z.string().optional(),
  trader_id: z.string().optional(),
});

const InputWithPageInfo = Input.extend({ pageParams: PageParamsSchema });

const commissionSummary = async (
  prisma: PrismaClient,
  affiliate_id: number,
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
      affiliate_id,
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

export const getCommissionReport = protectedProcedure
  .input(InputWithPageInfo)
  .query(({ ctx, input }) => {
    const affiliate_id = checkIsUser(ctx);
    return commissionSummary(ctx.prisma, affiliate_id, input);
  });

export const exportCommissionReport = protectedProcedure
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

    // const file_date = new Date().toISOString();
    // const generic_filename = `commission-report${file_date}`;
    //
    // console.log("export type ---->", exportType);
    // const commission_report = "commission-report";
    // await exportReportLoop(
    //   exportType || "csv",
    //   columns,
    //   generic_filename,
    //   commission_report,
    //   async (pageNumber, pageSize) =>
    //     commissionSummary(ctx.prisma, {
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
