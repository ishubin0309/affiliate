import { protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { pixel_logsModel } from "prisma/zod";
import { z } from "zod";
import {
  PageParamsSchema,
  exportReportLoop,
  exportType,
  pageInfo,
  reportColumns,
} from "./reports-utils";

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  merchant_id: z.number().optional(),
  country: z.string().optional(),
  banner_id: z.string().optional(),
  group_id: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
});

const InputWithPageInfo = Input.extend({ pageParams: PageParamsSchema });

const pixelLogReportSchema = z.object({
  data: z.array(pixel_logsModel),
  pageInfo,
  totals: z.any(),
});

const pixelLogReportData = async (
  prisma: PrismaClient,
  {
    from,
    to,
    merchant_id,
    country,
    banner_id,
    group_id,
    sortBy,
    sortOrder,
    pageParams,
  }: z.infer<typeof InputWithPageInfo>
) => {
  console.log("from ----->", from, " to ------->", to, merchant_id);
  let type_filter = {};
  if (banner_id) {
    type_filter = {
      banner_id: banner_id,
    };
  }

  if (group_id) {
    type_filter = {
      group_id: group_id,
    };
  }

  if (country) {
    type_filter = {
      country: country,
    };
  }

  if (merchant_id) {
    type_filter = {
      merchant_id: merchant_id,
    };
  }

  /*
              SELECT pl.id as plid,
                pm.* ,
                pl.*,
                af.username, mr.name, af.group_id, mr.id, af.id as affiliate_id
              FROM pixel_logs AS pl
                left join pixel_monitor pm on
                  pm.id = pl.pixelCode
                left join merchants mr on
                  pm.merchant_id = mr.id
                left join affiliates af on
                  pm.affiliate_id = af.id
                                          WHERE 2=2 and " . $globalWhere
                                                  . " pl.dateTime BETWEEN '" . $from . "' AND '" . $to . "' "
                                                  . " AND pm.merchant_id >0 "

                                                  .$whereType

                                                  . $where

                                          . " ORDER BY pl.dateTime ASC;";

                //}
             */
  console.log("type filter", type_filter);
  const pixelReport = await prisma.pixel_logs.findMany({
    orderBy: {
      dateTime: "asc",
    },
    where: {
      // ...type_filter,
      dateTime: {
        gte: from,
        lt: to,
      },
    },
    include: {
      pixel_monitor: {
        select: {
          affiliate: {
            select: {
              username: true,
              group_id: true,
              id: true,
              valid: true,
            },
          },
          merchant: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const arrRes = {
    data: pixelReport,
    totals: 0,
    pageInfo: {
      ...pageParams,
      totalItems: pixelReport.length,
    },
  };

  return arrRes;
};
export const getPixelLogReport = protectedProcedure
  .input(InputWithPageInfo)
  .output(pixelLogReportSchema)
  .query(({ ctx, input }) => pixelLogReportData(ctx.prisma, input));

export const exportPixelLogReportData = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const { exportType, reportColumns, ...params } = input;

    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        pixelLogReportData(ctx.prisma, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });
