import Head from "next/head";

import PixelMonitor from "../../components/affiliates/pixel/PixelMonitor";
import type { MyPage } from "../../components/common/types";
const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Pixel Monitor</title>
        <meta name="description" content="Affiliates Pixel Monitor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PixelMonitor />
    </>
  );
};

export default Page;
Page.Layout = "Affiliates";
