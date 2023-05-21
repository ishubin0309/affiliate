import { merchant_id } from "@/server/api/routers/affiliates/const";
import {
  PageParamsSchema,
  getPageOffset,
  pageInfo,
} from "@/server/api/routers/affiliates/reports/reports-utils";
import { protectedProcedure } from "@/server/api/trpc";
import { checkIsUser } from "@/server/api/utils";
import type { PrismaClient, data_install_type } from "@prisma/client";
import { z } from "zod";
import { dataInstallSchema } from "../reports";

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  country: z.string().optional(),
  banner_id: z.string().optional(),
  trader_id: z.number().optional(),
  param: z.string().optional(),
  param2: z.string().optional(),
  filter: z.string().optional(),
});

const InputWithPageInfo = Input.extend({ pageParams: PageParamsSchema });

const installReportSchema = z.object({
  data: z.array(dataInstallSchema),
  pageInfo,
  totals: z.any(),
});
const installReport = async (
  prisma: PrismaClient,
  affiliate_id: number,
  {
    from,
    to,
    country,
    banner_id,
    trader_id,
    param,
    param2,
    filter,
    pageParams,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const offset = getPageOffset(pageParams);
  // type filter
  let type_filter = {};
  if (merchant_id) {
    type_filter = {
      merchant_id: merchant_id,
    };
  }

  if (trader_id) {
    type_filter = {
      TraderID: trader_id,
    };
  }

  if (banner_id) {
    type_filter = {
      CreativeID: banner_id,
    };
  }

  if (param) {
    type_filter = {
      Param: param,
    };
  }

  if (country) {
    type_filter = {
      Country: country,
    };
  }

  if (param2) {
    type_filter = {
      Param2: param2,
    };
  }
  const data = await prisma.data_install.findMany({
    orderBy: {
      rdate: "asc",
    },
    include: {
      merchant_creative: {
        select: {
          id: true,
          title: true,
          url: true,
          language: {
            select: {
              title: true,
            },
          },
        },
      },
      merchant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      rdate: {
        gte: from,
        lt: to,
      },
      affiliate_id,
      merchant_id: {
        gt: 0,
        equals: Number(merchant_id),
      },
      type:
        filter === "all"
          ? ("" as data_install_type)
          : (filter as data_install_type),
    },
  });

  const arrRes = {
    data: data,
    totals: {},
    pageInfo: {
      ...pageParams,
      totalItems: data.length,
    },
  };

  return arrRes;
};

export const getInstallReport = protectedProcedure
  .input(InputWithPageInfo)
  .output(installReportSchema)
  .query(({ ctx, input }) => {
    const affiliate_id = checkIsUser(ctx);
    return installReport(ctx.prisma, affiliate_id, input);
  });

// export const exportInstallReport = publicProcedure
//   .input(paramsWithReport)
//   .mutation(async function ({ ctx, input }) {
//     const items_per_page = 5000;
//     const { exportType, ...params } = input;

//     const columns = [
//       "Event Type",
//       "Event Date",
//       "Trader ID",
//       "Trader Alias",
//       "Trader Status",
//       "Country",
//       "Affiliate ID",
//       "Affiliate Username",
//       "Merchant ID",
//       "Merchant Name",
//       "Creative ID",
//       "Creative Name",
//     ];
//     const file_date = new Date().toISOString();
//     const generic_filename = `install-report${file_date}`;

//     console.log("export type ---->", exportType);
//     const install_report = "install-report";

//     await exportReportLoop(
//       exportType || "csv",
//       columns,
//       generic_filename,
//       install_report,
//       async (page, items_per_page) =>
//         installReport({
//           ctx,
//           input: { ...params, page, items_per_page },
//         })
//     );

//     const bucketName = "reports-download-tmp";
//     const serviceKey = path.join(
//       __dirname,
//       "../../../../../api-front-dashbord-a4ee8aec074c.json"
//     );

//     const public_url = uploadFile(
//       serviceKey,
//       "api-front-dashbord",
//       bucketName,
//       generic_filename,
//       exportType ? exportType : "json"
//     );
//     return public_url;
//   });
