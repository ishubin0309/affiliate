import Head from "next/head";

import { CreativeMaterial } from "../../components/affiliates/creative/CreativeMaterial";
import type { MyPage } from "../../components/common/types";
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Creative Materials</title>
        <meta name="description" content="Affiliates Creative Materials" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <CreativeMaterial />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
