import Head from "next/head";

import { CountryReports } from "@/components/affiliates/reports/CountryReports";
import type { MyPage } from "../../../components/common/types";

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Commission Report</title>
        <meta name="description" content="Affiliates Country Report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CountryReports />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
