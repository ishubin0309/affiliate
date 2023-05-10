import Head from "next/head";

import { Tickets } from "@/components/affiliates/tickets/Tickets";
import type { MyPage } from "../../components/common/types";

const Page: MyPage = () => {
  return (
    <>
      <Head>
        <title>Supporrt - FAQ</title>
        <meta name="description" content="Privacy" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Tickets />
    </>
  );
};

export default Page;

Page.Layout = "Affiliates";
