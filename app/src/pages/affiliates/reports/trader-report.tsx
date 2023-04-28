import Head from "next/head";
import { TraderReports } from "../../../components/affiliates/reports/TraderReports";
import type { MyPage } from "../../../components/common/types";
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Trader Report</title>
        <meta name="description" content="Creative Report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TraderReports />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
