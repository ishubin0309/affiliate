import Head from "next/head";

import type { MyPage } from "../../components/common/types";

const RegisterSuccess: MyPage = () => {
  return (
    <>
      <Head>
        <title>Terms & Condition</title>
        <meta name="description" content="Terms" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-[800px] py-5">
        <p className="mb-2">
          Thank you for registering with Affiliate Dashboard. We are thrilled to
          have you on board and we appreciate the opportunity to serve you.
        </p>
        <p className="mb-2">
          Your registration is being processed and you will receive an email
          confirmation shortly. In the meantime, please feel free to explore our
          platform and familiarize yourself with the features and
          functionalities that we offer.
        </p>
        <p className="mb-2">
          Our team is dedicated to providing you with the best possible user
          experience, and we are committed to ensuring that your needs are met
          at every step of the way. If you have any questions or concerns,
          please do not hesitate to reach out to our support team for
          assistance.
        </p>
        <p className="mb-2">
          Thank you again for choosing us. We look forward to working with you
          and helping you achieve your goals.
        </p>
      </div>
    </>
  );
};

export default RegisterSuccess;

RegisterSuccess.Layout = "Affiliates";
