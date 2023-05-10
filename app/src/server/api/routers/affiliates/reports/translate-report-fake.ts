import {
  exportReportLoop,
  exportType,
  getPageOffset,
  getSortingInfo,
  pageInfo,
  PageParamsSchema,
  SortingParamSchema,
} from "@/server/api/routers/affiliates/reports/reports-utils";
import { publicProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import path from "path";
import { z } from "zod";
import { translateModel } from "../../../../../../prisma/zod";
import { uploadFile } from "../config";

const Input = z.object({
  from: z.date(),
  to: z.date(),
  search: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

const TranslateReportFakeResultSchema = z.object({
  data: z.array(translateModel),
  pageInfo,
  totals: z.any(),
});

const translateReportFake = async (
  prisma: PrismaClient,
  {
    from,
    to,
    search,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const offset = getPageOffset(pageParams);

  const orderBy = getSortingInfo(sortingParam);
  const [data, totals] = await Promise.all([
    prisma.translate.findMany({
      take: pageParams.pageSize,
      skip: offset,
      where: {
        langENG: { contains: search },
        // rdate: { gte: from, lte: to },
      },
      orderBy,
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
};

export const getTranslateReportFake = publicProcedure
  .input(InputWithPageInfo)
  .output(TranslateReportFakeResultSchema)
  .query(({ ctx, input }) => translateReportFake(ctx.prisma, input));

export const exportTranslateReportFake = publicProcedure
  .input(Input.extend({ exportType }))
  .mutation(async ({ ctx, input }) => {
    const { exportType, ...params } = input;

    const columns = [
      "id",
      "rdate",
      "source",
      "langENG",
      "langRUS",
      "langGER",
      "langFRA",
      "langITA",
      "langESP",
      "langHEB",
      "langARA",
      "langCHI",
      "langPOR",
      "langJAP",
    ];

    const file_date = new Date().toISOString();
    const fake_report = "fake-translate-report";
    const generic_filename = `${fake_report}${file_date}`;

    // console.log("export type ---->", exportType);
    await exportReportLoop(
      exportType || "csv",
      columns,
      generic_filename,
      fake_report,
      async (pageNumber: number, pageSize: number) =>
        translateReportFake(ctx.prisma, {
          ...params,
          pageParams: { pageNumber, pageSize },
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
