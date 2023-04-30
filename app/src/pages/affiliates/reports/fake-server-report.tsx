import { FakeTranslationReport } from "@/components/affiliates/reports/FakeTranslationReport";
import Head from "next/head";
import type { MyPage } from "../../../components/common/types";

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Trader Report</title>
        <meta name="description" content="FakeTranslationReport" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FakeTranslationReport />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
