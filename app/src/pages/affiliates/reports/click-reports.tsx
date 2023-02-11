import { Container, Flex, Select } from "@chakra-ui/react";
import Pagination from "@etchteam/next-pagination";
import '@etchteam/next-pagination/dist/index.css';
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from 'react';
import { api } from "../../../utils/api";
import styles from "./../../index.module.css";

const Page: NextPage = () => {
    const [displayType, setDisplayType] = useState("");
    const [merchantId, setMerchantId] = useState("");
    const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
    const { data } = api.affiliates.getClicksReport.useQuery({merchant_id:parseInt(merchantId)})
    const {data: merchants} = api.affiliates.getAllMerchants.useQuery();


  
  console.log("data ----->", data)
  console.log("merchants ----->",merchantId);
  

  return (
    <>
      <Head>
        <title>Quick Summary Report</title>
        <meta name="description" content="Affiliates Creative Materials" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <Flex direction="column" gap={2}>
      <Flex direction="row" gap={2}>
      <RangeDatepicker
        selectedDates={selectedDates}
        onDateChange={setSelectedDates}
      />
      <Select placeholder='Select option' onChange={(event) => setDisplayType(event.target.value)}>
      <option value='monthly'>monthly</option>
      <option value='weekly'>weekly</option>
      <option value='daily'>daily</option>
    </Select>
        <Select placeholder='Select option' onChange={(event) => setMerchantId(event.target.value)}>
        {merchants?.map((merchant,i) => {
            return <option key={i} value={merchant.id}>{merchant.name}</option>

        })}
        </Select>

      </Flex>
      </Flex>
      <Container marginTop={'90%'}>
        
        <Pagination total={100}  />

      </Container>

      </main>
    </>
  );
};

export default Page;
