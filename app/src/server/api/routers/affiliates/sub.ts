import { z } from "zod";

import type { Prisma, PrismaClient, sub_banners_type } from "@prisma/client";
import { indexBy, map, uniq } from "rambda";
import { SelectSchema } from "../../../db-schema-utils";
import { publicProcedure } from "../../trpc";
import { affiliate_id } from "./const";
import { PageParamsSchema, pageInfo } from "./reports/reports-utils";

const Input = z.object({
  type: z.string().optional(), //merchants_creativeModel.shape.type.nullish(),
  search: z.string().optional(),
});
const InputWithPageInfo = Input.extend({ pageParams: PageParamsSchema });

const MerchantSubCreativeModel = z.object({
  id: z.number(),
  rdate: z.date().optional(),
  last_update: z.date().optional(),
  valid: z.number().optional(),
  admin_id: z.number().optional(),
  merchant_id: z.number().optional(),
  language_id: z.number().optional(),
  promotion_id: z.number().optional(),
  title: z.string().optional(),
  type: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  file: z.string().optional(),
  url: z.string(),
  alt: z.string(),
  views: z.number().optional().nullable(),
  clicks: z.number().optional().nullable(),
});
const MerchantSubCreativeResultSchema = z.object({
  data: z.array(MerchantSubCreativeModel),
  pageInfo: pageInfo,
  totals: z.any(),
});

export const getMerchantSubCreativeMeta = publicProcedure
  .output(
    z.object({
      type: SelectSchema(z.string()),
    })
  )
  .query(async ({ ctx }) => {
    const data = await ctx.prisma.sub_banners.findMany({
      where: { valid: 1 },
      select: {
        id: true,
        // to distinct
        type: true,
      },
    });

    if (!data) {
      throw new Error("Failed to get");
    }

    return {
      type: map(
        (i) => ({ id: i, title: i }),
        uniq(data.map(({ type }) => type))
      ),
    };
  });

const translateMerchantSubCreative = async (
  prisma: PrismaClient,
  { type, search, pageParams }: z.infer<typeof InputWithPageInfo>
) => {
  const where: Prisma.sub_bannersWhereInput = {
    // merchant_id,
    valid: 1,
    type: type ? (type as sub_banners_type) : undefined,
    title: { contains: search },
  };

  const [stats, sub, totals] = await Promise.all([
    await prisma.sub_stats.groupBy({
      by: ["banner_id"],
      where: { affiliate_id },
      _sum: {
        clicks: true,
        views: true,
      },
    }),
    prisma.sub_banners.findMany({
      where,
    }),
    prisma.sub_banners.aggregate({
      _count: {
        id: true,
      },
      where,
    }),
  ]);

  const statDict = indexBy("banner_id", stats);

  const data = map(
    ({ id, ...data }) => ({
      id,
      ...data,
      clicks: statDict[id]?._sum.clicks,
      views: statDict[id]?._sum.views,
    }),
    sub
  );

  return {
    data: data,
    pageInfo: { ...pageParams, totalItems: totals._count.id },
    totals: undefined,
  };
};

export const getMerchantSubCreative = publicProcedure
  .input(InputWithPageInfo)
  .output(MerchantSubCreativeResultSchema)
  .query(({ ctx, input }) => translateMerchantSubCreative(ctx.prisma, input));
//
