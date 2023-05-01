import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { translateModel } from "../../../../../../prisma/zod";
import {
  getPageOffset,
  pageInfo,
  PageParamsSchema,
} from "@/server/api/routers/affiliates/reports/reports-utils";

const Input = z.object({
  from: z.date(),
  to: z.date(),
  search: z.string().optional(),
});

const InputWithPageInfo = Input.extend({ pageParams: PageParamsSchema });

const TranslateReportFakeResultSchema = z.object({
  data: z.array(translateModel),
  pageInfo,
  totals: z.any(),
});

export const getTranslateReportFake = publicProcedure
  .input(InputWithPageInfo)
  .output(TranslateReportFakeResultSchema)
  .query(async ({ ctx, input: { from, to, search, pageParams } }) => {
    const { prisma } = ctx;
    const offset = getPageOffset(pageParams);

    const [data, totals] = await Promise.all([
      prisma.translate.findMany({
        take: pageParams.pageSize,
        skip: offset,
      }),

      prisma.translate.aggregate({
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      data,
      pageInfo: { ...pageParams, totalItems: totals._count.id },
      totals: undefined,
    };
  });
