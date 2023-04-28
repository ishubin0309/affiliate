import Head from "next/head";

import { useRouter } from "next/router";
import { PaymentView } from "../../../components/affiliates/billing/PaymentView";
import type { MyPage } from "../../../components/common/types";
const Page: MyPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>PaymentView</title>
        <meta name="description" content="PaymentView" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PaymentView id={String(id)} />
    </>
  );
};

export default Page;
Page.Layout = "NoLayout";
