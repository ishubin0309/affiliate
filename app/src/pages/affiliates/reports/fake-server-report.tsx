import Head from "next/head";
import type { MyPage } from "../../../components/common/types";
import styles from "./../../index.module.css";
import { FakeTranslationReport } from "@/components/affiliates/reports/FakeTranslationReport";

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Trader Report</title>
        <meta name="description" content="FakeTranslationReport" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} style={{ marginTop: "20px" }}>
        <FakeTranslationReport />
      </main>
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
