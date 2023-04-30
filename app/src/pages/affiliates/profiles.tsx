import Head from "next/head";
import { Profiles } from "../../components/affiliates/profiles/Profiles";
import type { MyPage } from "../../components/common/types";

const ProfilePage: MyPage = () => {
  return (
    <>
      <Head>
        <title>Affiliates Profiles</title>
        <meta name="description" content="Affiliates Profiles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Profiles />
    </>
  );
};

export default ProfilePage;

ProfilePage.Layout = "Affiliates";
