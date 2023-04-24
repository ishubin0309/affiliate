import Head from "next/head";
import styles from "./../../index.module.css";

import type { MyPage } from "../../../components/common/types";
import CountryReport from "@/components/affiliates/dashboard/CountryReport";
import { CountryReports } from "@/components/affiliates/reports/CountryReports";

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Commission Report</title>
        <meta name="description" content="Affiliates Country Report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <CountryReports />
      </main>
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
