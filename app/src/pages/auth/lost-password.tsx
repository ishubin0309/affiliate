import { type NextPage } from "next";
import Head from "next/head";
import { RecoverLostPassword } from "../../components/affiliates/account/RecoverLostPassword";
import type { MyPage } from "../../components/common/types";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/common/Loading";
import AuthenticationHeader from "@/components/common/header/AuthenticationHeader";
import AuthenticationFooter from "@/components/common/footer/AuthenticationFooter";

const Page: MyPage = () => {
  const redirected = useAuth();

  if (redirected) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Affiliates Tickets</title>
        <meta name="description" content="Affiliates Tickets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="m-auto min-h-full items-center justify-center py-12">
          <div className="w-full max-w-xs">
            <AuthenticationHeader>
              Reset password for your <br />
              <span className="font-bold">Affillate</span> account
            </AuthenticationHeader>
            <RecoverLostPassword />
            <AuthenticationFooter />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
Page.Layout = "NoLayout";
