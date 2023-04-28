import { affiliate_id } from "@/server/api/routers/affiliates/const";
import { publicProcedure } from "@/server/api/trpc";
import type { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import moment from "moment/moment";
import { z } from "zod";

interface TypeFilter {
  merchant_id?: number;
  TraderID?: string;
  CreativeID?: number;
  Param?: string;
  Country?: string;
  Param2?: string;
}

const buildTypeFilter = (input: any): TypeFilter => {
  const typeFilter: TypeFilter = {};
  const keys = {
    merchant_id: "merchant_id",
    trader_id: "TraderID",
    banner_id: "CreativeID",
    parameter: "Param",
    country: "Country",
    parameter_2: "Param2",
  };

  Object.entries(keys).forEach(([key, value]) => {
    if (input[key]) {
      typeFilter[value as keyof TypeFilter] = input[key];
    }
  });

  return typeFilter;
};

export const getTraderReport = publicProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
      pageSize: z.number(),
      page: z.number(),
      merchant_id: z.number().optional(),
      country: z.string().optional(),
      banner_id: z.number().optional(),
      trader_id: z.string().optional(),
      parameter: z.string().optional(),
      parameter_2: z.string().optional(),
      filter: z.string().optional(),
    })
  )
  .query(
    async ({
      ctx,
      input: {
        from,
        to,
        pageSize,
        page,
        merchant_id,
        country,
        banner_id,
        trader_id,
        parameter,
        parameter_2,
        filter,
      },
    }) => {
      let offset;
      if (page && pageSize) {
        offset = (page - 1) * pageSize;
      }
      // TODO: check PHP why needed?
      const profileNames = await ctx.prisma.affiliates_profiles.findMany({
        where: {
          valid: 1,
          affiliate_id: affiliate_id,
        },
        select: {
          id: true,
          name: true,
        },
        take: 5,
      });

      // list of wallets
      // TODO: check PHP why needed?
      const resourceWallet = await ctx.prisma.merchants.findMany({
        where: {
          valid: 1,
        },
        select: {
          wallet_id: true,
          id: true,
        },
      });

      const baseTypeFilter = buildTypeFilter({
        merchant_id,
        country,
        banner_id,
        trader_id,
        parameter,
        parameter_2,
      });

      // type filter
      let type_filter: Prisma.reporttradersWhereInput = {};
      if (filter === "real") {
        type_filter = {
          ...baseTypeFilter,
          TraderStatus: "real",
        };
      } else if (filter === "lead") {
        type_filter = {
          ...baseTypeFilter,
          TraderStatus: "lead",
        };
      } else if (filter === "demo") {
        type_filter = {
          ...baseTypeFilter,
          TraderStatus: "demo",
        };
      } else if (filter === "frozen") {
        type_filter = {
          ...baseTypeFilter,
          TraderStatus: "frozen",
        };
      } else if (filter === "ftd" || filter === "totalftd") {
        type_filter = {
          ...baseTypeFilter,
          AND: [{ TraderStatus: "frozen" }, { TraderStatus: "demo" }],
          FirstDeposit: {
            gte: formatISO(from),
            lt: formatISO(to),
          },
        };
      } else if (filter === "activeTrader") {
        type_filter = {
          ...baseTypeFilter,
          QualificationDate: {
            gte: formatISO(from),
            lt: formatISO(to),
          },
          AND: [{ TraderStatus: "frozen" }, { TraderStatus: "demo" }],
        };
      }

      //trader resource
      let trader_report_resource;
      if (filter === "ftd" || filter === "totalftd") {
        // TODO: missing pagination use https://github.com/sandrewTx08/prisma-paginate
        trader_report_resource = await ctx.prisma.reporttraders.findMany({
          take: pageSize,
          skip: offset,
          orderBy: {
            RegistrationDate: "desc",
            TraderID: "asc",
          },
          where: {
            ...type_filter,
            affiliate_id: affiliate_id,
          },
          include: {
            data_reg: {
              select: {
                saleStatus: true,
                freeParam5: true,
              },
            },
            affiliate: {
              select: {
                group_id: true,
              },
            },
          },
        });
      } else {
        // "SELECT rt.*,
        //    dr.saleStatus as SaleStatusOriginal,
        //    dr.freeParam5 as freeParam5,
        //    aff.group_id as GroupID
        //    FROM ReportTraders rt
        //      INNER JOIN affiliates aff ON rt.AffiliateID = aff.id
        //      INNER JOIN data_reg dr ON dr.trader_id = rt.TraderID
        //    WHERE 1=1 ".$where."
        //    ORDER BY RegistrationDate DESC, rt.TraderID ASC";

        // TODO: missing pagination use https://github.com/sandrewTx08/prisma-paginate
        trader_report_resource = await ctx.prisma.reporttraders.findMany({
          take: pageSize,
          skip: offset,
          orderBy: {
            TraderID: "asc",
          },
          where: {
            ...type_filter,
            RegistrationDate: {
              gte: moment(from).toISOString(),
              lt: moment(to).toISOString(),
            },
            affiliate_id: affiliate_id,
          },
          include: {
            data_reg: {
              select: {
                saleStatus: true,
                freeParam5: true,
              },
            },
            affiliate: {
              select: {
                group_id: true,
              },
            },
          },
        });
      }

      let totalFTD = 0;
      let totalTotalDeposit = 0;
      let totalDepositAmount = 0;
      let totalVolumeAmount = 0;
      let totalBonusAmount = 0;
      let totalWithdrawalAmount = 0;
      let totalChargeBackAmount = 0;
      let totalNetRevenue = 0;
      let totalTrades = 0;
      let totalTotalCom = 0;

      for (const item of trader_report_resource) {
        totalFTD += Number(item.FTDAmount);
        totalNetRevenue += Number(item.NetDeposit);
        totalTotalDeposit += Number(item.TotalDeposits);
        totalDepositAmount += Number(item.DepositAmount);
        totalVolumeAmount += Number(item.Volume);
        totalBonusAmount += Number(item.BonusAmount);
        totalWithdrawalAmount += Number(item.WithdrawalAmount);
        totalChargeBackAmount += Number(item.ChargeBackAmount);
        totalTrades += Number(item.Trades);
        totalTotalCom += Number(item.Commission);
      }
      const arrRes: any = {};

      arrRes["data"] = Object.values(trader_report_resource);
      arrRes["pageNumber"] = page;
      arrRes["pageSize"] = pageSize;
      arrRes["totals"] = {
        totalFTD,
        totalTotalDeposit,
        totalDepositAmount,
        totalVolumeAmount,
        totalBonusAmount,
        totalWithdrawalAmount,
        totalChargeBackAmount,
        totalNetRevenue,
        totalTrades,
        totalTotalCom,
      };

      return arrRes ;
    }
  );
