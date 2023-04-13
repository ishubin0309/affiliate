import { affiliate_id } from "@/server/api/routers/affiliates/const";
import { publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import paginator from "prisma-paginate";
import { z } from "zod";

export const getCommissionReport = publicProcedure
  .input(
    z.object({
      from: z.date().optional(),
      to: z.date().optional(),
      commission: z.string().optional(),
      trader_id: z.string().optional(),
      page: z.number().int().optional(),
      items_per_page: z.number().int().optional(),
    })
  )
  .query(
    async ({
      ctx,
      input: { from, to, trader_id, commission, page, items_per_page },
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

      // console.log("data ----->", data);

      return data;
    }
  );
