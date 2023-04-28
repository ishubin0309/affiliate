import Head from "next/head";
import { CreativeReport } from "../../../components/affiliates/reports/CreativeReport";

import type { MyPage } from "../../../components/common/types";

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Creative Report</title>
        <meta name="description" content="Creative Report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreativeReport />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
