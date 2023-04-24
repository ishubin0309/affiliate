/**
 * Retrieves country data based on user level and group ID.
 * @param userInfo - An object containing user information such as level and group ID.
 * @returns An object containing country data and report filename.
 */
import { PrismaClient } from "@prisma/client";
import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { affiliate_id } from "@/server/api/routers/affiliates/const";

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

  let where = " 1 = 1 "; // Set a default where condition to retrieve all data
  let whereDashboard = " 1 = 1 "; // Set a default where condition for dashboard data

  const appendConditionS = (where: string, condition: string, value?: string) =>
    value !== null && value !== undefined
      ? `${where} AND ${condition} = '${value}' `
      : where;

  const appendCondition = (
    where: string,
    condition: string,
    value?: number | null
  ) =>
    value !== null && value !== undefined
      ? `${where} AND ${condition} = ${value} `
      : where;

  where = appendCondition(where, "group_id", group_id);
  where = appendCondition(where, "MerchantID", merchant_id);
  whereDashboard = appendCondition(whereDashboard, "MerchantID", merchant_id);
  where = appendCondition(where, "AffiliateID", affiliate_id);
  whereDashboard = appendCondition(whereDashboard, "AffiliateID", affiliate_id);

  where = appendConditionS(where, "country_id", country_id);
  whereDashboard = appendConditionS(whereDashboard, "CountryID", country_id);

  let where_main: string = where; // Copy the where clause to a variable for main data
  where_main = where_main.replace("affiliate_id", "traffic.affiliate_id"); // Replace any instances of 'affiliate_id' with 'traffic.affiliate_id'
  where_main = where_main.replace("merchant_id", "traffic.merchant_id"); // Replace any instances of 'merchant_id' with 'traffic.merchant_id'
  where_main = where_main.replace("country_id", "traffic.country_id"); // Replace any instances of 'country_id' with 'traffic.country_id'

  let install_main: string = where; // Copy the where clause to a variable for installation data
  install_main = install_main.replace(
    "affiliate_id",
    "data_install.affiliate_id"
  ); // Replace any instances of 'affiliate_id' with 'data_install.affiliate_id'
  install_main = install_main.replace(
    "merchant_id",
    "data_install.merchant_id"
  ); // Replace any instances of 'merchant_id' with 'data_install.merchant_id'
  install_main = install_main.replace("country_id", "data_install.country"); // Replace any instances of 'country_id' with 'data_install.country'

  let traders_main: string = where; // Copy the where clause to a variable for trader data
  traders_main = traders_main.replace(
    "affiliate_id",
    "ReportTraders.AffiliateID"
  ); // Replace any instances of 'affiliate_id' with 'ReportTraders.AffiliateID'
  traders_main = install_main.replace(
    "merchant_id",
    "ReportTraders.merchant_id"
  ); // Replace any instances of 'merchant_id' with 'data_install.merchant_id'
  traders_main = install_main.replace("country_id", "ReportTraders.country"); // Replace any instances of 'country_id' with 'data_install.country'

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
    install_main: string,
    from: Date,
    to: Date
  ): Promise<{ [key: string]: number }> => {
    console.log(`muly:getInstallationsData ${install_main}`, {});
    const installationsData = await prisma.$queryRaw<
      {
        installations: number;
        country: string;
      }[]
    >`
        SELECT COUNT(affiliate_id) AS installations, country
        FROM data_install
        WHERE ${install_main}
          AND data_install.rdate >= '${from}'
          AND data_install.rdate <= '${to}'
        GROUP BY country
      `;

    console.log(`muly:getInstallationsData`, { installationsData });
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

  console.log(`muly:countryReport:merchants_creative_stats:A`, {
    from,
    to,
    whereDashboard,
  });
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
  StatsData.forEach((item) => {
    const countryID = item.CountryID === null ? "-" : item.CountryID;

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
  console.log(`muly:countryReport:ReportTraders:A`, {});
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
        WHERE ReportTraders.RegistrationDate >= '${from}' AND ReportTraders.RegistrationDate <= '${to}'  AND ${traders_main} GROUP BY Country`;

  const countryArray: Record<string, CountryDataType> = {};

  ReportTradersDataItems.forEach((item) => {
    const country = !item["country"] ? "-" : item["country"];

    const base = baseCountryArray[country];
    if (base) {
      countryArray[country] = {
        ...base,
        cpi: InstallationsDataItems[country] || 0,
        merchant: MerchantsDataItems[item["MerchantID"]] || "",
        country: item["country"],
        // type: item["type"],
        volume: item["Volume"],
        withdrawal: item["WithdrawalAmount"],
        leads: item["leads"],
        demo: item["demo"],
        real: item["reals"],
        depositingAccounts: item["NextDeposits"],
        real_ftd: item["demo"],
        ftd: item["FirstDeposit"],
        ftd_amount: item["FTDAmount"],
        sumDeposits: item["DepositAmount"],
        bonus: item["BonusAmount"],
        chargeback: item["ChargeBackAmount"],
        netRevenue: item["NetDeposit"],
        pnl: item["PNL"],
        totalCom: item["Commission"],
        Qftd: item["Qftd"],
      };
    }
  });

  console.log(ReportTradersDataItems);
  return Object.values(countryArray);
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

    console.log(`muly:countryReport A`, {});
    const countryData = await countryReport({
      prisma,
      from,
      to,
      userInfo,
      affiliate_id,
      merchant_id,
    });

    return countryData;
  });
