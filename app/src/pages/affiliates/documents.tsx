import Head from "next/head";

import { Documents } from "../../components/affiliates/documents/Documents";
import type { MyPage } from "../../components/common/types";
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Documents</title>
        <meta name="description" content="Affiliates Documents" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Documents />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
