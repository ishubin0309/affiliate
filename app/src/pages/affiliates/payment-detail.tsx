import MyDocument from "@/components/affiliates/billing/payment-detail";
import type { MyPage } from "@/components/common/types";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);
const Page: MyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.affiliates.getPaymentDetails.useQuery({
    paymentId: String(id),
  });
  const { payments_paid, affiliatesDetail, merchants } = data || {};

  return (
    <>
      <Head>
        <title>PaymentView</title>
        <meta name="description" content="PaymentView" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {typeof window !== "undefined" && payments_paid && affiliatesDetail && (
        <PDFViewer height={window.innerHeight} width={window.innerWidth}>
          <MyDocument
            payments_paid={payments_paid}
            affiliatesDetail={affiliatesDetail}
            merchant={merchants?.APIpass ?? ""}
          />
        </PDFViewer>
      )}
    </>
  );
};

export default Page;
Page.Layout = "NoLayout";
