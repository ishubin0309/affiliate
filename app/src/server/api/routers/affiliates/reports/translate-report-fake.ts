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
  sorting: z
    .object({
      id: z.string(),
      desc: z.boolean(),
    })
    .array()
    .optional(),
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
  .query(async ({ ctx, input: { from, to, search, pageParams, sorting } }) => {
    const { prisma } = ctx;
    const offset = getPageOffset(pageParams);
    const _sorting = sorting?.map((x) => {
      let res: {
        [key: string]: string;
      } = {};
      res[x.id] = x.desc ? "desc" : "asc";
      return res;
    });
    const [data, totals] = await Promise.all([
      prisma.translate.findMany({
        take: pageParams.pageSize,
        skip: offset,
        where: {
          langENG: { contains: search },
          // rdate: { gte: from, lte: to },
        },
        orderBy: _sorting,
      }),

      prisma.translate.aggregate({
        _count: {
          id: true,
        },
        where: {
          langENG: { contains: search },
          // rdate: { gte: from, lte: to },
        },
      }),
    ]);

    console.log(`muly:country report `, { data: data.length, totals });

    return {
      data,
      pageInfo: { ...pageParams, totalItems: totals._count.id },
      totals: undefined,
    };
  });
