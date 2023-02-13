import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import NextLink from "next/link";
import { Link, Stack, Text } from "@chakra-ui/react";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const links = [
    { href: "/affiliates/dashboard", title: "Dashboard" },
    { href: "/affiliates/creative", title: "Creative Materials" },
    { href: "/affiliates/sub", title: "Sub Affiliate Creative Materials" },
    { href: "/affiliates/account", title: "Account Details" },
    { href: "/affiliates/account-payment", title: "Account Payment Details" },
    { href: "/affiliates/profiles", title: "Profiles" },
    { href: "/affiliates/billings", title: "Billing" },
    { href: "/affiliates/tickets", title: "Tickets" }, 
    { href: "/affiliates/signup", title: "Sign Up" },
    { href: "/affiliates/documents", title: "Documents" },
    { href: "/affiliates/commissions", title: "Commission Structure" },
    { href: "/affiliates/reports/quick-summary", title: "Reports -> Quick Summary" },
    { href: "/affiliates/reports/commission-report", title: "Reports -> Commission Report" },
    { href: "/affiliates/signin", title: "Sign In" },
  ];

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Stack gap={2} m={12}>
          {links.map(({ href, title }) => (
            <Link key={href} as={NextLink} href={href}>
              <Text as="b">{title}</Text>
            </Link>
          ))}
        </Stack>
      </main>
    </>
  );
};

export default Home;
