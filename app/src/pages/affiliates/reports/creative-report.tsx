import { Container, Flex, Input, Select } from "@chakra-ui/react";
import Pagination from "@etchteam/next-pagination";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../../utils/api";
import styles from "./../../index.module.css";

const Page: NextPage = () => {
	const router = useRouter();
	const page = parseInt(router?.query?.page as string);
	const items_per_page = parseInt(router?.query?.size as string);
	const [displayType, setDisplayType] = useState("");
	const [selectedDates, setSelectedDates] = useState<Date[]>([
		new Date(),
		new Date(),
	]);
	const { data } = api.affiliates.getCreativeReport.useQuery({
		from: selectedDates[0],
		to: selectedDates[1],
	});
	const { data: merchants } = api.affiliates.getAllMerchants.useQuery();

	console.log("data ----->", data);
	//   console.log("merchants ----->",data);

	return (
		<>
			<Head>
				<title>Creative Report</title>
				<meta name="description" content="Creative Report" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<Flex direction="column" gap={2}>
					<Flex direction="row" gap={2}>
						<RangeDatepicker
							selectedDates={selectedDates}
							onDateChange={setSelectedDates}
						/>

						<Select
							placeholder="Merchant"
							onChange={(event) =>
								setDisplayType(event.target.value)
							}
						>
							{merchants?.map((merchant, i) => {
								return (
									<option key={i} value={merchant.name}>
										{merchant.name}
									</option>
								);
							})}
						</Select>

						<Input placeholder="Banner Id" />

						<Select
							placeholder="Creative Type"
							onChange={(event) =>
								setDisplayType(event.target.value)
							}
						>
							<option value="">All</option>
							<option value="image">Image</option>
							<option value="mobileleader">Mobile Leader</option>
							<option value="mobilesplash">Mobile Splash</option>
							<option value="flash">Flash</option>
							<option value="widget">Widget</option>
							<option value="link">Text Link</option>
							<option value="mail">E-mail</option>
							<option value="coupon">Coupon</option>
						</Select>
					</Flex>
				</Flex>
				<Container marginTop={"45%"}>
					<Pagination total={100} />
				</Container>
			</main>
		</>
	);
};

export default Page;
