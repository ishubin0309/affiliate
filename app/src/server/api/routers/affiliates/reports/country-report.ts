/**
 * Retrieves country data based on user level and group ID.
 * @param userInfo - An object containing user information such as level and group ID.
 * @returns An object containing country data and report filename.
 */
import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { affiliate_id } from "@/server/api/routers/affiliates/const";
import type { Sql } from "@prisma/client/runtime";
import { sub } from "date-fns";
import { debugSaveData } from "@/server/api/routers/affiliates/reports/reports-utils";
import { convertPrismaResultsToNumbers } from "@/utils/prisma-convert";

interface UserInfo {
  level: string;
  group_id?: number;
}

interface CountryReportParams {
  userInfo: UserInfo;
  prisma: PrismaClient;
  merchant_id?: number;
  affiliate_id?: number;
  country_id?: string;
  from: Date;
  to: Date;
}

const BaseCountryArrayItem = z.object({
  clicks: z.number(),
  views: z.number(),
  country: z.string(),
});

const CountryData = BaseCountryArrayItem.extend({
  cpi: z.number(),
  merchant: z.string(),
  volume: z.number(),
  withdrawal: z.number(),
  leads: z.number(),
  demo: z.number(),
  real: z.number(),
  depositingAccounts: z.number(),
  real_ftd: z.number(),
  ftd: z.number(),
  ftd_amount: z.number(),
  sumDeposits: z.number(),
  bonus: z.number(),
  chargeback: z.number(),
  netRevenue: z.number(),
  pnl: z.number(),
  totalCom: z.number(),
  Qftd: z.number(),
});

type CountryDataType = z.infer<typeof CountryData>;

export const countryReport = async ({
  userInfo,
  prisma,
  merchant_id,
  affiliate_id,
  country_id,
  from,
  to,
}: CountryReportParams): Promise<CountryDataType[]> => {
  const userLevel: string = userInfo.level;
  const group_id = userLevel === "manager" ? userInfo.group_id : null;

  let where = Prisma.sql`1 = 1`; // Set a default where condition to retrieve all data
  let whereDashboard = Prisma.sql`1 = 1`; // Set a default where condition for dashboard data
  let install_main = Prisma.sql`1 = 1`;
  let traders_main = Prisma.sql`1 = 1`;

  const appendCondition = (
    where: Sql,
    condition: string,
    value?: string | number | null
  ) => {
    if (value !== null && value !== undefined) {
      where = Prisma.sql`${where} AND ${condition} = ${value}`;
    }
    return where;
  };

  where = appendCondition(where, "group_id", group_id);
  install_main = appendCondition(install_main, "group_id", group_id);
  traders_main = appendCondition(traders_main, "group_id", group_id);

  where = appendCondition(where, "merchant_id", merchant_id);
  install_main = appendCondition(install_main, "merchant_id", merchant_id);
  traders_main = appendCondition(traders_main, "merchant_id", merchant_id);
  whereDashboard = appendCondition(whereDashboard, "merchant_id", merchant_id);

  where = appendCondition(where, "affiliate_id", affiliate_id);
  install_main = appendCondition(install_main, "affiliate_id", affiliate_id);
  traders_main = appendCondition(traders_main, "AffiliateID", affiliate_id);
  whereDashboard = appendCondition(
    whereDashboard,
    "affiliate_id",
    affiliate_id
  );

  where = appendCondition(where, "country_id", country_id);
  install_main = appendCondition(install_main, "country_id", country_id);
  traders_main = appendCondition(traders_main, "country_id", country_id);
  whereDashboard = appendCondition(whereDashboard, "CountryID", country_id);

  // $sqlMerchants = "SELECT * from merchants";
  // $MerchantsData = function_mysql_query($sqlMerchants,__FILE__);
  // $MerchantsDataItems = [];
  // while($item = mysql_fetch_assoc($MerchantsData)){
  // 	$MerchantsDataItems[$item['id']]['id'] = $item['id'];
  // 	$MerchantsDataItems[$item['id']]['name'] = $item['name'];
  // }

  const getMerchantsData = async (): Promise<{
    [key: number]: string;
  }> => {
    const merchantsData = await prisma.merchants.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    const merchantsDataItems: { [key: number]: string } = {};

    merchantsData.forEach(({ id, name }) => {
      merchantsDataItems[id] = name;
    });

    return merchantsDataItems;
  };

  // $sqlInstallations = "SELECT COUNT(affiliate_id) AS installations, country from data_install WHERE ".$install_main." AND data_install.rdate >= '".$from."' AND data_install.rdate <='".$to. "' GROUP BY country ";
  // $InstallationsData = function_mysql_query($sqlInstallations,__FILE__);
  // $InstallationsDataItems = [];
  // while($item = mysql_fetch_assoc($InstallationsData)){
  //     $InstallationsDataItems[$item['country']] = $item['installations'];
  // }

  const getInstallationsData = async (
    install_main: Sql,
    from: Date,
    to: Date
  ): Promise<{ [key: string]: number }> => {
    const installationsData = await prisma.$queryRaw<
      {
        installations: number;
        country: string;
      }[]
    >`
        SELECT COUNT(affiliate_id) AS installations, country
        FROM data_install
        WHERE ${install_main}
          AND data_install.rdate >= ${from}
          AND data_install.rdate <= ${to}
        GROUP BY country
      `;

    const installationsDataItems: { [key: string]: number } = {};

    installationsData.forEach((item: any) => {
      installationsDataItems[item.country] = item.installations;
    });

    return installationsDataItems;
  };

  // PHP code:
  // $sqlStats = "SELECT SUM(Clicks) as clicks, SUM(Impressions) as impressions, AffiliateID, MerchantID, CountryID FROM merchants_creative_stats WHERE Date >= '".$from."' AND Date <= '".$to."' AND ".$whereDashboard." GROUP BY CountryID";
  // $StatsData = function_mysql_query($sqlStats,__FILE__);

  // TypeScript code:
  type StatsDataItem = {
    clicks: number;
    impressions: number;
    AffiliateID: number;
    MerchantID: number;
    CountryID: string | null;
  };

  const StatsData = await prisma.$queryRaw<
    StatsDataItem[]
  >`SELECT SUM(Clicks) as clicks,
           SUM(Impressions) as impressions,
            AffiliateID, MerchantID, CountryID
            FROM merchants_creative_stats
            WHERE Date >= ${from} AND
            Date <= ${to} AND
            ${whereDashboard}
            GROUP BY CountryID`;

  const MerchantsDataItems = await getMerchantsData();

  const InstallationsDataItems = await getInstallationsData(
    install_main,
    from,
    to
  );

  // PHP code:
  // $statsAllData = [];

  // PHP code:
  // while ($item = mysql_fetch_assoc($StatsData)) {
  //     $item['CountryID'] = $item['CountryID']=='' ? '-' : $item['CountryID'];
  //
  //     $countryArray[$item['CountryID']]['clicks'] = $item['clicks'];
  //     $countryArray[$item['CountryID']]['views'] = $item['impressions'];
  //     $countryArray[$item['CountryID']]['country'] = $item['CountryID'];
  // }

  // TypeScript code:

  const baseCountryArray: Record<
    string,
    z.infer<typeof BaseCountryArrayItem>
  > = {};
  StatsData.map(convertPrismaResultsToNumbers).forEach((item) => {
    const countryID = item.CountryID || "-";

    baseCountryArray[countryID] = {
      clicks: item.clicks,
      views: item.impressions,
      country: countryID,
    };
  });

  type ReportTradersSummary = {
    AffiliateID: number;
    MerchantID: number;
    country: string;
    Volume: number;
    WithdrawalAmount: number;
    leads: number;
    demo: number;
    reals: number;
    NextDeposits: number;
    FTDAmount: number;
    BonusAmount: number;
    ChargeBackAmount: number;
    NetDeposit: number;
    PNL: number;
    Commission: number;
    DepositAmount: number;
    Qftd: number;
    FirstDeposit: number;
  };

  // Define the SQL query
  const ReportTradersDataItems = await prisma.$queryRaw<
    ReportTradersSummary[]
  >`SELECT AffiliateID, MerchantID, country,
        SUM(ReportTraders.Volume) as Volume,
        SUM(ReportTraders.WithdrawalAmount) as WithdrawalAmount,
        SUM(CASE ReportTraders.TraderStatus WHEN 'leads' THEN 1 ELSE 0 END) leads,
        SUM(CASE ReportTraders.TraderStatus WHEN 'demo' THEN 1 ELSE 0 END) demo,
        SUM(CASE ReportTraders.TraderStatus WHEN 'real' THEN 1 ELSE 0 END) reals,
        SUM(ReportTraders.NextDeposits) as NextDeposits,
        SUM(ReportTraders.FTDAmount) as FTDAmount,
        SUM(ReportTraders.BonusAmount) as BonusAmount,
        SUM(ReportTraders.ChargeBackAmount) as ChargeBackAmount,
        SUM(ReportTraders.NetDeposit) as NetDeposit,
        SUM(ReportTraders.PNL) as PNL,
        SUM(ReportTraders.Commission) as Commission,
        SUM(ReportTraders.DepositAmount) as DepositAmount,
        SUM(CASE WHEN (ReportTraders.PNL > 0 OR ReportTraders.NextDeposits > 0 OR ReportTraders.Volume > 0 ) THEN 1 ELSE 0 END) as Qftd,
        SUM(CASE ReportTraders.FirstDeposit WHEN ReportTraders.FirstDeposit > '0000-00-00 00:00:00' THEN 1 ELSE 0 END) as FirstDeposit
        FROM ReportTraders
        WHERE ReportTraders.RegistrationDate >= ${from} AND
        ReportTraders.RegistrationDate <= ${to} AND
        ${traders_main}
        GROUP BY Country`;

  const countryArray: CountryDataType[] = [];
  ReportTradersDataItems.map(convertPrismaResultsToNumbers).forEach((item) => {
    const country = item["country"] || "-";
    const base = baseCountryArray[country];
    if (base) {
      countryArray.push({
        ...base,
        cpi: InstallationsDataItems[country] || 0,
        merchant: MerchantsDataItems[item["MerchantID"]] || "",
        country: item.country,
        // type: item.type,
        volume: item.Volume,
        withdrawal: item.WithdrawalAmount,
        leads: item.leads,
        demo: item.demo,
        real: item.reals,
        depositingAccounts: item.NextDeposits,
        real_ftd: item.demo,
        ftd: item.FirstDeposit,
        ftd_amount: item.FTDAmount,
        sumDeposits: item.DepositAmount,
        bonus: item.BonusAmount,
        chargeback: item.ChargeBackAmount,
        netRevenue: item.NetDeposit,
        pnl: item.PNL,
        totalCom: item.Commission,
        Qftd: item.Qftd,
      });
    }
  });

  return countryArray;
};

export const getCountryReport = publicProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
      merchant_id: z.number().optional(),
    })
  )
  .output(z.array(CountryData))
  .query(async ({ ctx, input: { from, to, merchant_id } }) => {
    const { prisma } = ctx;

    const userInfo = { level: "all" };

    const countryData = await countryReport({
      prisma,
      from: sub(new Date(from), { years: 2 }),
      to,
      userInfo,
      affiliate_id: 557,
      merchant_id,
    });

    debugSaveData("countryData", countryData);
    return countryData;
  });
