import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { affiliate_id } from "@/server/api/routers/affiliates/const";
import type { Sql } from "@prisma/client/runtime";
import { endOfDay, startOfDay, sub } from "date-fns";
import { debugSaveData } from "@/server/api/routers/affiliates/reports/reports-utils";
import { convertPrismaResultsToNumbers } from "@/utils/prisma-convert";

const Input = z.object({
  lastDays: z.number().int(),
  value: z.enum(["Clicks", "Accounts", "FTD"]),
});

interface CountryReportParams {
  prisma: PrismaClient;
  affiliate_id?: number;
  from: Date;
  to: Date;
  value: z.infer<typeof Input.shape.value>;
}

const CountryData = z.object({
  value: z.number(),
  country: z.string(),
});

type CountryDataType = z.infer<typeof CountryData>;

export const countryReport = async ({
  prisma,
  affiliate_id,
  from,
  to,
  value,
}: CountryReportParams): Promise<CountryDataType[]> => {
  if (value === "Clicks") {
    return prisma.$queryRaw<CountryDataType[]>`SELECT
            SUM(Clicks) as value,
            CountryID as country
            FROM merchants_creative_stats
            WHERE
            CountryID IS NOT NULL AND LENGTH(CountryID) > 0 AND
            Date >= ${from} AND
            Date <= ${to} AND
            AffiliateID = ${affiliate_id}
            GROUP BY CountryID
            ORDER BY value
            LIMIT 5`;
  } else if (value === "Accounts") {
    return prisma.$queryRaw<CountryDataType[]>`SELECT country,
        SUM(CASE ReportTraders.TraderStatus WHEN 'real' THEN 1 ELSE 0 END) value
        FROM ReportTraders
        WHERE
        LENGTH(Country) > 0 AND
        ReportTraders.RegistrationDate >= ${from} AND
        ReportTraders.RegistrationDate <= ${to} AND
        AffiliateID = ${affiliate_id}
        GROUP BY Country
        ORDER BY value
        LIMIT 5`;
  } else {
    return prisma.$queryRaw<CountryDataType[]>`SELECT country,
        SUM(CASE ReportTraders.TraderStatus WHEN 'real' THEN 1 ELSE 0 END) value
        FROM ReportTraders
        WHERE
        LENGTH(Country) > 0 AND
        ReportTraders.RegistrationDate >= ${from} AND
        ReportTraders.RegistrationDate <= ${to} AND
        AffiliateID = ${affiliate_id}
        GROUP BY Country
        ORDER BY value
        LIMIT 5`;
  }
};

export const getCountryReportDashboard = publicProcedure
  .input(Input)
  .output(z.array(CountryData))
  .query(async ({ ctx, input: { lastDays, value } }) => {
    const { prisma } = ctx;

    const to = endOfDay(new Date());

    const countryData = await countryReport({
      prisma,
      from: startOfDay(sub(to, { days: lastDays })),
      to,
      affiliate_id: 557,
      value,
    });

    console.log(`muly:countryData`, { countryData });
    return countryData;
  });
