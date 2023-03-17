import { SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Switch,
  Checkbox,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { AreaChart, LineChart } from "@tremor/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

import { useEffect, useState } from "react";

import type {
  CountryReportType,
  TopMerchantCreativeType,
} from "../../../server/db-types";
import { api } from "../../../utils/api";
import {
  conversionFormatter,
  performanceFormatter,
} from "../../../utils/format";

import { DataTable } from "../../common/data-table/DataTable";

import type { ChangeEvent } from "react";
import {
  AcauisitionIcon,
  ClicksIcon,
  ComissionIcon,
  SignupIcon,
} from "../../icons";
import { DateRangeSelect, useDateRange } from "../../common/DateRangeSelect";

import Affiliates from "../../../layouts/AffiliatesLayout";

const fields = [
  "Impressions",
  "Clicks",
  "Install",
  "Leads",
  "Demo",
  "Real Account",
  "FTD",
  "Withdrawal",
  "ChargeBack",
  "Active Trader",
  "Commission",
];
const columnHelper = createColumnHelper<TopMerchantCreativeType>();
const reportColumnHelper = createColumnHelper<CountryReportType>();

export const Dashboard = () => {
  const { from, to } = useDateRange();

  const [reportFields, setReportFields] = useState<
    { id: number; title: string; value: string; isChecked: boolean }[]
  >([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data } = api.affiliates.getDashboard.useQuery({
    from,
    to,
  });
  const { data: performanceChart } =
    api.affiliates.getPerformanceChart.useQuery({ from, to });
  const { data: conversionChart } = api.affiliates.getConversionChart.useQuery({
    from,
    to,
  });
  const { data: creative } = api.affiliates.getTopMerchantCreative.useQuery();
  const { data: report } = api.affiliates.getCountryReport.useQuery();
  const { data: reportsHiddenCols } =
    api.affiliates.getReportsHiddenCols.useQuery();
  const { data: account, refetch } = api.affiliates.getAccount.useQuery();
  const upsertReportsField = api.affiliates.upsertReportsField.useMutation();

  useEffect(() => {
    const fieldsArray = fields.map((field, i) => {
      return {
        id: i,
        title: field,
        value: field.replace(/\s/g, ""),
        isChecked: !reportsHiddenCols?.includes(field),
      };
    });
    setReportFields(fieldsArray);
  }, [reportsHiddenCols]);

  if (!data || !creative || !report || !performanceChart || !conversionChart) {
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
        return !!row.original.file ? (
          <Image
            objectFit="cover"
            maxW={{ base: "100%", sm: "173px" }}
            src={row.original.file}
            alt={row.original.alt}
          />
        ) : null;
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
      cell: (info) => info.getValue(),
      header: "Report",
    }),
  ];

  const handleReportField = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = reportFields.map((item) => {
      const temp = Object.assign({}, item);
      if (temp.id === parseInt(event.target.value)) {
        temp.isChecked = event.target.checked;
      }
      return temp;
    });
    setReportFields(value);
    const hiddenCols = value.filter((item) => item.isChecked === false);
    const remove_fields = hiddenCols
      .map((item) => {
        return item.value;
      })
      .join("|");
    await upsertReportsField.mutateAsync({
      remove_fields,
    });
  };

  return (
    <div className="pt-3.5">
      <div className="block md:flex md:justify-between font-medium text-base">
        <div className="flex items-center">
          <span className="text-[#2262C6]">Affliate Program</span>
          &nbsp;-&nbsp;Dashboard
        </div>
        <div className="flex">
          {/* <button className="px-6 py-2 flex space-x-2 items-center border rounded border-[#D7D7D7] bg-white">
            <span>Month to Date</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M17 3.00024H16V1.00024C16 0.735028 15.8946 0.480674 15.7071 0.293137C15.5196 0.105601 15.2652 0.000244141 15 0.000244141C14.7348 0.000244141 14.4804 0.105601 14.2929 0.293137C14.1054 0.480674 14 0.735028 14 1.00024V3.00024H6V1.00024C6 0.735028 5.89464 0.480674 5.70711 0.293137C5.51957 0.105601 5.26522 0.000244141 5 0.000244141C4.73478 0.000244141 4.48043 0.105601 4.29289 0.293137C4.10536 0.480674 4 0.735028 4 1.00024V3.00024H3C2.20435 3.00024 1.44129 3.31631 0.87868 3.87892C0.316071 4.44153 0 5.20459 0 6.00024V7.00024H20V6.00024C20 5.20459 19.6839 4.44153 19.1213 3.87892C18.5587 3.31631 17.7956 3.00024 17 3.00024Z"
                fill="#2262C6"
              />
              <path
                d="M0 17.0002C0 17.7959 0.316071 18.5589 0.87868 19.1216C1.44129 19.6842 2.20435 20.0002 3 20.0002H17C17.7956 20.0002 18.5587 19.6842 19.1213 19.1216C19.6839 18.5589 20 17.7959 20 17.0002V9.00024H0V17.0002Z"
                fill="#2262C6"
              />
            </svg>
          </button> */}
          <DateRangeSelect />
          <button className="ml-5 bg-[#2262C6] text-white px-8 py-2 rounded-md">
            Update
          </button>

          <button 
            className="ml-5 bg-white px-3 pt-1.5 pb-2 rounded-md drop-shadow"
            onClick={onOpen}
          >
            <SettingsIcon />
          </button>
          {/* <IconButton
            variant="outline"
            colorScheme="#0E132B"
            size="sm"
            aria-label="Setting"
            icon={<SettingsIcon />}
            onClick={onOpen}
          /> */}
        </div>
      </div>
        
      <Modal isOpen={isOpen} size='3xl' onClose={onClose} isCentered >
        
        <ModalOverlay />
        <ModalContent ml={4} mr={4}>
          
          <div className="flex pl-8 pt-4 justify-between items-end">
            <div className="text-[#282560] font-medium">Manage Field On Report - Quick Summary</div>
            <img
              alt="..."
              className="mr-4 w-10 h-10 rounded-full align-middle "
              src="/img/icons/close.png"
              onClick={onClose}
            />
          </div>
          <div className="text-[#717171] pl-8 pt-2 text-sm">
            Please activate the fields you want  to display on the report:
          </div>
          
          <ModalBody mt={16}>
            <SimpleGrid minChildWidth='300px' spacing='40px' pr={2} pl={2}>
              {reportFields.map((field) => {
                return (
                  <Box key={field.id}>
                    <FormControl display="flex" alignItems="center">
                      <input
                        type="checkbox"
                        id={`report-field-${field.id}`}
                        checked={field.isChecked}
                        value={field.id}
                        onChange={(e) => void handleReportField(e)}
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <FormLabel
                        htmlFor={`report-field-${field.id}`}
                        mb="0"
                        mr="0"
                        ml="4"
                        color="black"
                        fontSize="md"
                      >
                        {field.title}
                      </FormLabel>
                    </FormControl>
                  </Box>
                );
              })}
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" size="sm" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      <SimpleGrid minChildWidth="200px" spacing="15px" mt="3">
        {reportFields
          .filter((item) => item.isChecked === true)
          .map((item) => {
            interface Sum {
              [index: string]: number;
            }
            const sumObject = data[0]?._sum as Sum;
            console.log(sumObject);
            const value = sumObject ? sumObject[item.value] : 0;

            const icon = () => {
              let result;
              switch (item.title) {
                case "Clicks":
                  result = <ClicksIcon width="40" height="40" fill="#0E132B" />;
                  break;

                case "Real Account":
                  result = <SignupIcon width="40" height="40" fill="#0E132B" />;
                  break;

                case "Active Trader":
                  result = (
                    <AcauisitionIcon width="40" height="40" fill="#0E132B" />
                  );
                  break;

                case "Commission":
                  result = (
                    <ComissionIcon width="40" height="40" fill="#0E132B" />
                  );
                  break;

                default:
                  result = <SignupIcon width="40" height="40" fill="#0E132B" />;
                  break;
              }
              return result;
            };
            return (
              <Box
                key={item.id}
                width="100%"
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
                {icon()}
                {/* <ClicksIcon width="40" height="40" fill="#0E132B" /> */}
                <Box>
                  <Text fontSize="md" fontWeight="normal" color="#0E132B">
                    {item.title}
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    {value}
                  </Text>
                </Box>
              </Box>
            );
          })}
      </SimpleGrid>
      <Stack mt="8">
        <Tabs>
          <Flex direction="row" alignItems="center">
            <TabList>
              <Tab>Performace Chart</Tab>
              <Tab>Conversion Chart</Tab>
            </TabList>
          </Flex>
          <TabPanels>
            <TabPanel>
              <AreaChart
                data={performanceChart}
                categories={["Accounts", "Active Traders"]}
                dataKey="date"
                height="h-72"
                colors={["indigo", "cyan"]}
                valueFormatter={performanceFormatter}
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
        <Flex direction="row" columnGap="10px">
          <Box flex="1" bg="white" border="1px solid gray" padding="20px 16px">
            <Heading as="h6" size="xs" mb="2">
              Country Report
            </Heading>
            <DataTable data={report} columns={reportColumns} />
          </Box>
          <Box
            width="35%"
            bg="white"
            border="1px solid gray"
            padding="20px 16px"
          >
            <Heading as="h6" size="xs" mb="2">
              Your Account Manager
            </Heading>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              rowGap="5px"
            >
              <Box display="flex" flexDirection="row" columnGap="5px">
                <Text width="100px" color="#8f8f8f" flex="0 0 100px">
                  Name:
                </Text>
                <Text color="#0E132B">
                  {account?.first_name} {account?.last_name}
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" columnGap="5px">
                <Text width="100px" color="#8f8f8f" flex="0 0 100px">
                  Email:
                </Text>
                <Text cursor="pointer" wordBreak="break-word">
                  <Link
                    href={`mailto:${account?.mail || ""}`}
                    textDecoration="none"
                    _hover={{ textDecoration: "none" }}
                  >
                    {account?.mail}
                  </Link>
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" columnGap="5px">
                <Text width="100px" color="#8f8f8f" flex="0 0 100px">
                  Skype:
                </Text>
                <Text cursor="pointer" wordBreak="break-word">
                  <Link
                    href={`skype:${account?.mail || ""}?call`}
                    textDecoration="none"
                    _hover={{ textDecoration: "none" }}
                  >
                    {account?.mail}
                  </Link>
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" columnGap="5px">
                <Text width="100px" color="#8f8f8f" flex="0 0 100px">
                  Desk:
                </Text>
                <Text color="#0E132B">VIP01</Text>
              </Box>
              <Box display="flex" flexDirection="row" columnGap="5px">
                <Text width="100px" color="#8f8f8f" flex="0 0 100px">
                  Sub Affiliates Link:
                </Text>
                <Text
                  color="#f1792f"
                  fontWeight="semibold"
                  wordBreak="break-word"
                >
                  <Link href="https://go.gamingaffiliates.co/?ctag=a500-b0-p">
                    https://go.gamingaffiliates.co/?ctag=a500-b0-p
                  </Link>
                </Text>
              </Box>
              <Box display="flex" flexDirection="row" columnGap="5px">
                <Text width="100px" color="#8f8f8f" flex="0 0 100px">
                  Commission:
                </Text>
                <Text color="#069731" fontWeight="bold">
                  <Link
                    href="https://go.gamingaffiliates.co/affiliate/account.php?act=commission"
                    textDecoration="none"
                    _hover={{ textDecoration: "none" }}
                  >
                    $13,857.00
                  </Link>
                </Text>
              </Box>
              <Box mt="8">
                <Text color="#F37A20" fontWeight="semibold">
                  Need some help?{" "}
                  <Link href="https://go.gamingaffiliates.co/affiliate/tickets.php?act=new">
                    Click Here
                  </Link>
                </Text>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Stack>
      <Stack mt="5">
        <Heading as="h6" size="xs" mb="2">
          Top Performing Creative
        </Heading>
        <DataTable data={creative} columns={columns} />
      </Stack>
    </div>
  );
};

Dashboard.getLayout = Affiliates;
