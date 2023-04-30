import { TRPCError } from "@trpc/server";
import { indexBy, map } from "rambda";
import { z } from "zod";
import { addFreeTextSearchJSFilter } from "../../../../../prisma/prisma-utils";
import { publicProcedure } from "../../trpc";
import { affiliate_id } from "./const";

export const getPaymentsPaid = publicProcedure
  .input(
    z.object({
      search: z.string().optional(),
    })
  )
  .query(async ({ ctx, input: { search } }) => {
    const where = {
      // affiliate_id,
      // valid: 1,
      // ...addFreeTextSearchWhere("paymentID", search),
    };

    const [payments_details, payments_paid] = await Promise.all([
      ctx.prisma.payments_details.groupBy({
        by: ["paymentID"],
        where: { affiliate_id },
        // _sum: {
        //   amount: true,
        // },
        _count: {
          id: true,
        },
      }),
      addFreeTextSearchJSFilter(
        await ctx.prisma.payments_paid.findMany({
          where,
          orderBy: [{ id: "desc" }],
        }),
        "paymentID",
        search
      ),
    ]);

    const detailDict = indexBy("paymentID", payments_details);
    console.log(`muly:where`, {
      where,
      payments_details: payments_details.map((a) => ({
        ...a,
        // sum: a._sum.amount,
      })),
      // payments_paid,
      search,
      t: typeof search,
    });
    return map(
      ({ paymentID, ...data }) => ({
        paymentID,
        ...data,
        totalFTD: detailDict[paymentID]?._count.id,
        // amount: detailDict[paymentID]?._sum.amount,
      }),
      payments_paid
    );
  });

export const getPaymentDetails = publicProcedure
  .input(z.object({ paymentId: z.string() }))
  .query(async ({ ctx, input: { paymentId } }) => {
    if (!paymentId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid paymentID.`,
      });
    }

    const [payments_details, payments_paid] = await Promise.all([
      ctx.prisma.payments_details.findMany({
        where: { paymentID: paymentId },
      }),
      ctx.prisma.payments_paid.findUnique({
        where: { paymentID: paymentId },
      }),
    ]);
    const affiliatesDetail = await ctx.prisma.affiliates.findFirst({
      where: { id: payments_paid?.affiliate_id },
    });
    const bonusesDetail = await ctx.prisma.payments_details.findMany({
      where: {
        month: payments_paid?.month,
        year: payments_paid?.year,
        reportType: "bonus",
        paymentID: payments_paid?.paymentID,
        status: "approved",
      },
    });
    const merchants = await ctx.prisma.merchants.findFirst({
      where: {
        id: parseInt(affiliatesDetail?.merchants ?? "0"),
      },
    });

    return {
      payments_details,
      payments_paid,
      affiliatesDetail,
      bonusesDetail,
      merchants,
    };
  });
