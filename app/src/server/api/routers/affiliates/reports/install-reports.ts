import {
  affiliate_id,
  merchant_id,
} from "@/server/api/routers/affiliates/const";
import {
  exportReportLoop,
  pageParams,
  reportParams,
} from "@/server/api/routers/affiliates/reports/reports-utils";
import { publicProcedure } from "@/server/api/trpc";
import type { data_install_type } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { Simplify } from "@trpc/server";
import path from "path";
import paginator from "prisma-paginate";
import { z } from "zod";
import { uploadFile } from "../config";

const params = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  country: z.string().optional(),
  banner_id: z.string().optional(),
  trader_id: z.number().optional(),
  param: z.string().optional(),
  param2: z.string().optional(),
  filter: z.string().optional(),
});

const paramsWithPage = params.extend(pageParams);
const paramsWithReport = params.extend(reportParams);

type InputType = z.infer<typeof paramsWithPage>;

export const installReport = async ({
  ctx,
  input: {
    from,
    to,
    country,
    banner_id,
    trader_id,
    param,
    param2,
    filter,
    page,
    items_per_page,
  },
}: {
  ctx: Simplify<unknown>;
  input: InputType;
}) => {
  const prismaClient = new PrismaClient();
  const paginate = paginator(prismaClient);

  let offset;
  if (page && items_per_page) {
    offset = (page - 1) * items_per_page;
  }
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
  const data = await paginate.data_install.paginate({
    limit: items_per_page ? items_per_page : 10,
    page: page,
    orderBy: {
      rdate: "asc",
    },
    where: {
      rdate: {
        gte: from,
        lt: to,
      },
      affiliate_id: affiliate_id,
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
  let banner_info = [] as any;
  let aff_info = [] as any;
  for (let i = 0; i < Object.keys(data).length; i++) {
    const bannerInfo = await paginate.merchants_creative.paginate({
      limit: items_per_page ? items_per_page : 10,
      page: page,
      include: {
        language: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id: data.result[i]?.banner_id,
      },
    });
    banner_info = bannerInfo;

    const affInfo = await paginate.affiliates.paginate({
      limit: items_per_page ? items_per_page : 10,
      page: page,
      where: {
        valid: 1,
        id: affiliate_id,
      },
    });
    aff_info = affInfo;
  }

  const merchants = await paginate.merchants.paginate({
    limit: items_per_page ? items_per_page : 10,
    page: page,
    where: {
      valid: 1,
      id: merchant_id,
    },
  });

  const merged = [];

  for (let i = 0; i < data.result.length; i++) {
    merged.push({
      ...data.result[i],
      ...aff_info[i],
      ...banner_info[i],
      ...merchants.result[i],
    });
  }

  console.log("merged ------>", merged);
  return merged as Array<Record<string, any>>;
};

export const getInstallReport = publicProcedure
  .input(paramsWithPage)
  .query(installReport);

export const exportInstallReport = publicProcedure
  .input(paramsWithReport)
  .mutation(async function ({ ctx, input }) {
    const items_per_page = 5000;
    const { exportType, ...params } = input;

    const columns = [
      "Event Type",
      "Event Date",
      "Trader ID",
      "Trader Alias",
      "Trader Status",
      "Country",
      "Affiliate ID",
      "Affiliate Username",
      "Merchant ID",
      "Merchant Name",
      "Creative ID",
      "Creative Name",
    ];
    const file_date = new Date().toISOString();
    const generic_filename = `install-report${file_date}`;

    console.log("export type ---->", exportType);
    const install_report = "install-report";

    await exportReportLoop(
      exportType || "csv",
      columns,
      generic_filename,
      install_report,
      async (page, items_per_page) =>
        installReport({
          ctx,
          input: { ...params, page, items_per_page },
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
