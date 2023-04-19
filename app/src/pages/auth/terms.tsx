import Terms from "@/components/affiliates/terms/Terms";
import { Loading } from "@/components/common/Loading";
import AuthenticationHeader from "@/components/common/header/AuthenticationHeader";
import type { MyPage } from "@/components/common/types";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import { useState } from "react";
import AuthenticationFooter from "../../components/common/footer/AuthenticationFooter";

const Page: MyPage = () => {
  const redirected = useAuth();
  const [isSignUpTerms, setIsSignUpTerms] = useState(true);

  if (redirected) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Affiliates account terms</title>
        <meta name="description" content="Affiliates Creative Materials" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center px-5">
        <AuthenticationHeader></AuthenticationHeader>

        <Terms isSignUpTerms={isSignUpTerms} />
        <AuthenticationFooter />
      </main>
    </>
  );
};

export default Page;
Page.Layout = "NoLayout";
