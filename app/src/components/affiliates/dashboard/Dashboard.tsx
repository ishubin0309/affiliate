import {
  Container,
  Box,
  Grid,
  GridItem,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Image,
  Heading,
  Text,
} from "@chakra-ui/react";
import { AreaChart, LineChart, DonutChart } from "@tremor/react";
import type {
  TopMerchantCreativeType,
  CountryReportType,
} from "../../../server/db-types";
import { DataTable } from "../../common/data-table/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import { api } from "../../../utils/api";
import { serverStoragePath } from "../../utils";

const cities = [
  {
    name: "New York",
    sales: 9800,
  },
  {
    name: "London",
    sales: 4567,
  },
  {
    name: "Hong Kong",
    sales: 3908,
  },
  {
    name: "San Francisco",
    sales: 2400,
  },
  {
    name: "Singapore",
    sales: 1908,
  },
  {
    name: "Zurich",
    sales: 1398,
  },
];

const dataFormatter = (number: number) => {
  return Intl.NumberFormat("us").format(number).toString();
};

const conversionFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}%`;

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

const columnHelper = createColumnHelper<TopMerchantCreativeType>();
const reportColumnHelper = createColumnHelper<CountryReportType>();

export const Dashboard = () => {
  const { data } = api.affiliates.getDashboard.useQuery();

  const { data: performanceChart } =
    api.affiliates.getPerformanceChart.useQuery();

  const { data: conversionChart } =
    api.affiliates.getConversionChart.useQuery();

  const { data: creative } = api.affiliates.getTopMerchantCreative.useQuery();

  const { data: report } = api.affiliates.getCountryReport.useQuery();

  console.log("data:", data);
  console.log("report:", report);

  if (!creative && !performanceChart && !conversionChart && !report) {
    return null;
  }
  const columns = [
    columnHelper.accessor("merchant.name", {
      cell: (info) => info.getValue(),
      header: "Merchant",
    }),
    columnHelper.accessor("language.title", {
      cell: (info) => info.getValue(),
      header: "Language",
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
      header: "Creative Name",
    }),
    columnHelper.accessor("file", {
      cell: ({ row }) => {
        return (
          <Image
            objectFit="cover"
            maxW={{ base: "100%", sm: "173px" }}
            src={serverStoragePath(row.original.file)}
            alt={row.original.alt}
          />
        );
      },
      header: "Preview",
    }),
    columnHelper.accessor("width", {
      cell: ({ row }) => {
        return (
          <span>
            {row.original.width}x{row.original.height}
          </span>
        );
      },
      header: "LP Preview",
    }),
  ];

  const reportColumns = [
    reportColumnHelper.accessor("merchant_id", {
      cell: (info) => info.getValue(),
      header: "#",
    }),
    reportColumnHelper.accessor("country", {
      cell: (info) => info.getValue(),
      header: "Country",
    }),
    reportColumnHelper.accessor("_sum.Commission", {
      cell: (info) => {
        return <span>{parseFloat(info.getValue()).toFixed(2)}</span>;
      },
      header: "Report",
    }),
  ];

  return (
    <Container maxW="container.lg" py="4">
      <Heading as="h5" size="sm">
        Affiliate Program Dashboard
      </Heading>
      <Grid templateColumns="repeat(4, 1fr)" gap={6} mt="3">
        <GridItem w="100%">
          <Box
            border="1px solid gray"
            borderRadius="5"
            bg="white"
            p="4"
            display="flex"
            alignItems="center"
            columnGap="5"
            color="#0E132B"
            _hover={{ borderColor: "#069731", cursor: "pointer" }}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
              >
                <g transform="translate(14.247 14.246)">
                  <path
                    className="a"
                    d="M201.143,207.755l-6.837-6.836-3.314,3.314a1.171,1.171,0,0,1-1.94-.458l-6.63-19.888a1.171,1.171,0,0,1,1.482-1.482l19.888,6.63a1.171,1.171,0,0,1,.458,1.94l-3.314,3.314,6.836,6.837a1.172,1.172,0,0,1,0,1.657l-4.971,4.971A1.171,1.171,0,0,1,201.143,207.755Z"
                    transform="translate(-182.362 -182.344)"
                  ></path>
                </g>
                <g transform="translate(14.063)">
                  <path
                    className="a"
                    d="M181.172,9.375A1.171,1.171,0,0,1,180,8.2V1.172a1.172,1.172,0,1,1,2.344,0V8.2A1.171,1.171,0,0,1,181.172,9.375Z"
                    transform="translate(-180)"
                  ></path>
                </g>
                <g transform="translate(4.119 4.119)">
                  <path
                    className="a"
                    d="M58.036,59.693,53.063,54.72a1.172,1.172,0,1,1,1.657-1.657l4.972,4.972a1.172,1.172,0,0,1-1.657,1.657Z"
                    transform="translate(-52.72 -52.72)"
                  ></path>
                </g>
                <g transform="translate(4.119 19.034)">
                  <path
                    className="a"
                    d="M53.063,250.607a1.172,1.172,0,0,1,0-1.657l4.972-4.972a1.172,1.172,0,0,1,1.657,1.657l-4.972,4.972A1.172,1.172,0,0,1,53.063,250.607Z"
                    transform="translate(-52.72 -243.634)"
                  ></path>
                </g>
                <g transform="translate(19.034 4.119)">
                  <path
                    className="a"
                    d="M243.976,59.694a1.172,1.172,0,0,1,0-1.657l4.972-4.972a1.172,1.172,0,1,1,1.657,1.657l-4.972,4.972A1.172,1.172,0,0,1,243.976,59.694Z"
                    transform="translate(-243.633 -52.721)"
                  ></path>
                </g>
                <g transform="translate(0 14.063)">
                  <path
                    className="a"
                    d="M8.2,182.344H1.172a1.172,1.172,0,1,1,0-2.344H8.2a1.172,1.172,0,0,1,0,2.344Z"
                    transform="translate(0 -180)"
                  ></path>
                </g>
              </svg>
            </span>
            <Box>
              <Text fontSize="md" fontWeight="normal" color="#0E132B">
                Clicks
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                {data[0]?._sum.Clicks}
              </Text>
            </Box>
          </Box>
        </GridItem>
        <GridItem w="100%">
          <Box
            border="1px solid gray"
            borderRadius="5"
            bg="white"
            p="4"
            display="flex"
            alignItems="center"
            columnGap="5"
            color="#0E132B"
            _hover={{ borderColor: "#069731", cursor: "pointer" }}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="39.755"
                height="40"
                viewBox="0 0 39.755 40"
              >
                <g transform="translate(-32 -32)">
                  <path
                    className="a"
                    d="M32.893,72H61.286V32.893A.893.893,0,0,0,60.393,32h-27.5a.893.893,0,0,0-.893.893V71.107A.893.893,0,0,0,32.893,72Zm6.792-14.535a.714.714,0,0,1-.515.249h-.027a.714.714,0,0,1-.505-.209l-2.143-2.143,1.01-1.01,1.6,1.6,3.784-4.414,1.085.93Zm4.286,5.714-4.286,5a.714.714,0,0,1-.515.249h-.027a.714.714,0,0,1-.505-.209l-2.143-2.143,1.01-1.01,1.6,1.6,3.784-4.414ZM49.143,67H45.571V65.571h3.571Zm7.143,0H50.571V65.571h5.714Zm0-3.571H45.571V62H56.286ZM45.571,56.286V54.857h3.571v1.429Zm10.714,0H50.571V54.857h5.714Zm0-3.571H45.571V51.286H56.286Zm2.143-19.286h1.429v1.429H58.429Zm-2.857,0H57v1.429H55.571ZM40.281,36.353,46.7,33.49a.714.714,0,0,1,.582,0l6.42,2.863a.714.714,0,0,1,.415.764l-.541,3.425,0,.017A11.688,11.688,0,0,1,48.9,47.934l-1.484,1.078a.714.714,0,0,1-.844,0l-1.557-1.147A11.692,11.692,0,0,1,40.4,40.531l0-.017-.535-3.4A.714.714,0,0,1,40.281,36.353Zm-6.138-2.924h4.286v1.429H34.143Zm0,2.857H37v1.429H34.143Zm0,17.5a2.5,2.5,0,0,1,2.5-2.5h3.214v1.429H36.643a1.073,1.073,0,0,0-1.071,1.071v3.571a1.073,1.073,0,0,0,1.071,1.071h3.571a1.073,1.073,0,0,0,1.071-1.071V57h1.429v.357a2.5,2.5,0,0,1-2.5,2.5H36.643a2.5,2.5,0,0,1-2.5-2.5Zm0,10.714a2.5,2.5,0,0,1,2.5-2.5h3.214v1.429H36.643A1.073,1.073,0,0,0,35.571,64.5v3.571a1.073,1.073,0,0,0,1.071,1.071h3.571a1.073,1.073,0,0,0,1.071-1.071v-.357h1.429v.357a2.5,2.5,0,0,1-2.5,2.5H36.643a2.5,2.5,0,0,1-2.5-2.5Z"
                  ></path>
                  <path
                    className="a"
                    d="M376,52.375V90.556h2.194a.893.893,0,0,0,.88-.743l5.954-34.945a.893.893,0,0,0-.725-1.029Z"
                    transform="translate(-313.286 -18.556)"
                  ></path>
                  <path
                    className="a"
                    d="M141.357,76.546l1.137.837,1.061-.771a10.266,10.266,0,0,0,4.105-6.467l.454-2.876-5.629-2.51-5.629,2.51.449,2.848A10.269,10.269,0,0,0,141.357,76.546Zm-1.232-6.64,1.638,1.638,3.78-3.781,1.01,1.01-4.286,4.286a.714.714,0,0,1-1.01,0l-2.143-2.143Z"
                    transform="translate(-95.494 -29.834)"
                  ></path>
                </g>
              </svg>
            </span>
            <Box>
              <Text fontSize="md" fontWeight="normal" color="#0E132B">
                Signups
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                {data[0]?._sum.RealAccount}
              </Text>
            </Box>
          </Box>
        </GridItem>
        <GridItem w="100%">
          <Box
            border="1px solid gray"
            borderRadius="5"
            bg="white"
            p="4"
            display="flex"
            alignItems="center"
            columnGap="5"
            color="#0E132B"
            _hover={{ borderColor: "#069731", cursor: "pointer" }}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="40"
                viewBox="0 0 36 40"
              >
                <g transform="translate(-24.991)">
                  <g transform="translate(24.991 0)">
                    <path
                      className="a"
                      d="M56.6,27.618a4.676,4.676,0,0,1-8.46-2.709V23.244H46.462a4.637,4.637,0,1,1,0-9.274h1.677V12.306a4.654,4.654,0,0,1,3.875-4.569A10.152,10.152,0,1,0,36.771,18.658C29.355,21.206,26.216,29.13,25.018,37.163A2.492,2.492,0,0,0,27.508,40H56.77a2.5,2.5,0,0,0,2.489-2.837A36.422,36.422,0,0,0,56.6,27.618ZM38.824,10.089a1.514,1.514,0,0,1-3.028,0,6.333,6.333,0,0,1,6.347-6.3,1.5,1.5,0,1,1,0,3.006A3.31,3.31,0,0,0,38.824,10.089Z"
                      transform="translate(-24.991 0)"
                    ></path>
                    <g transform="translate(19.72 10.471)">
                      <path
                        className="a"
                        d="M268.753,129.6h-4.467v-4.467a1.832,1.832,0,0,0-1.834-1.834h0a1.839,1.839,0,0,0-1.843,1.834V129.6h-4.467a1.834,1.834,0,1,0,0,3.669h4.467v4.467a1.834,1.834,0,0,0,1.843,1.834h0a1.832,1.832,0,0,0,1.834-1.834V133.27h4.467a1.834,1.834,0,1,0,0-3.669Z"
                        transform="translate(-254.307 -123.3)"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
            <Box>
              <Text fontSize="md" fontWeight="normal" color="#0E132B">
                Acauisition
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                86
              </Text>
            </Box>
          </Box>
        </GridItem>
        <GridItem w="100%">
          <Box
            border="1px solid gray"
            borderRadius="5"
            bg="white"
            p="4"
            display="flex"
            alignItems="center"
            columnGap="5"
            color="#0E132B"
            _hover={{ borderColor: "#069731", cursor: "pointer" }}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="40"
                viewBox="0 0 20 40"
              >
                <g transform="translate(-116.652 0)">
                  <path
                    className="a"
                    d="M132.02,18.17a45.7,45.7,0,0,0-4.719-2.214,10.5,10.5,0,0,1-2.591-1.5,2.37,2.37,0,0,1,.558-4.155,4.411,4.411,0,0,1,1.586-.339,11.681,11.681,0,0,1,5.963,1.223c.941.471,1.252.322,1.57-.694.335-1.074.614-2.164.925-3.247a1.144,1.144,0,0,0-.71-1.512,14.765,14.765,0,0,0-3.763-1.165c-1.706-.273-1.706-.281-1.714-2.057-.008-2.5-.008-2.5-2.431-2.5-.351,0-.7-.008-1.052,0-1.132.033-1.323.24-1.355,1.421-.016.529,0,1.057-.008,1.594-.008,1.57-.016,1.545-1.467,2.09-3.508,1.322-5.676,3.8-5.907,7.766-.207,3.511,1.563,5.882,4.345,7.609a47.215,47.215,0,0,0,5.429,2.528,8.007,8.007,0,0,1,1.977,1.206,2.854,2.854,0,0,1-.646,4.924,6.294,6.294,0,0,1-3.484.471,15.148,15.148,0,0,1-5.309-1.644c-.981-.529-1.268-.388-1.6.71-.287.95-.542,1.908-.8,2.867-.343,1.289-.215,1.594.973,2.2a16.5,16.5,0,0,0,4.783,1.421c1.291.215,1.331.273,1.347,1.661.008.628.008,1.264.016,1.892.008.793.375,1.256,1.164,1.272.893.017,1.794.017,2.687-.008a1.043,1.043,0,0,0,1.108-1.2c0-.859.04-1.727.008-2.586a1.358,1.358,0,0,1,1.14-1.553A8.955,8.955,0,0,0,132.02,18.17Z"
                    transform="translate(0 0)"
                  ></path>
                </g>
              </svg>
            </span>
            <Box>
              <Text fontSize="md" fontWeight="normal" color="#0E132B">
                Comission
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                $13,857.00
              </Text>
            </Box>
          </Box>
        </GridItem>
      </Grid>
      <Stack mt="5">
        <Tabs>
          <TabList>
            <Tab>Performace Chart</Tab>
            <Tab>Conversion Chart</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <AreaChart
                data={performanceChart}
                categories={["Accounts", "Active Traders"]}
                dataKey="date"
                height="h-72"
                colors={["indigo", "cyan"]}
                valueFormatter={dataFormatter}
                marginTop="mt-4"
              />
            </TabPanel>
            <TabPanel>
              <LineChart
                data={conversionChart}
                dataKey="date"
                categories={["Conversions"]}
                colors={["blue"]}
                valueFormatter={conversionFormatter}
                marginTop="mt-6"
                yAxisWidth="w-10"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
      <Stack mt="5">
        <Heading as="h6" size="xs" mb="2">
          Country Report
        </Heading>
        <DataTable data={report} columns={reportColumns} />
      </Stack>
      <Stack mt="5">
        <Heading as="h6" size="xs" mb="2">
          Top Performing Creative
        </Heading>
        <DataTable data={creative} columns={columns} />
      </Stack>
    </Container>
  );
};
