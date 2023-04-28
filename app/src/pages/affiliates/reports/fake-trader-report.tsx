import { FakeTraderReports } from "@/components/affiliates/reports/FakeTraderReports";
import Head from "next/head";
import type { MyPage } from "../../../components/common/types";

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Trader Report</title>
        <meta name="description" content="Creative Report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FakeTraderReports />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
