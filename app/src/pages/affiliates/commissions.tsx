import Head from "next/head";

import { Commissions } from "../../components/affiliates/commissions/Commissions";
import type { MyPage } from "../../components/common/types";
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Commission Structure</title>
        <meta name="description" content="Affiliates Commission Structure" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Commissions />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
