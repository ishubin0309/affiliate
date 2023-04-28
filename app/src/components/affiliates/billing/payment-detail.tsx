import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { formatPrice } from "../../../utils/format";
import { Table } from "../invoice/Table";
import { HeaderInformation } from "../invoice/header-information";
import { Heading } from "../invoice/heading";
import { styles } from "../invoice/styles";
const tables = {
  table1: {
    columns: ["Merchant", "Deal Type", "Quantity", "Total Price"],
    footers: [{ title: "Sub Total", value: 0 }],
    data: [],
  },
  table2: {
    columns: ["Merchant", "Deal", "Unit Price", "Quantity", "Price"],
    footers: [
      { title: "Gap from Previous month", value: 0 },
      { title: "Extra Total", value: 0 },
      { title: "Commission Total", value: 0 },
      { title: "Total Payment", value: 0 },
    ],
    data: [""],
  },
};
interface Props {
  merchant: string;
  affiliatesDetail: {
    id: number;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    mail: string;
    phone: string;
    city: string;
    company: string;
    country: string;
    paymentMethod: string;
    pay_account: string;
    pay_email: string;
    pay_country: number;
    pay_company: string;
    credit: number;
    sub_com: number;
  };
  payments_paid: {
    id: number;
    month: string;
    year: string;
    affiliate_id: number;
    paid: number;
    paymentID: string;
    transaction_id: string;
    notes: string;
    extras: string;
    total: number;
    sentMail: number;
    amount_gap_from_previous_month: number;
  };
}
// Create Document Component
const MyDocument = ({ payments_paid, affiliatesDetail, merchant }: Props) => {
  const previousMonthGap = payments_paid?.amount_gap_from_previous_month;

  const extraTotal =
    parseFloat(payments_paid?.extras.split("|")[2] ?? "0") *
    parseFloat(payments_paid?.extras.split("|")[3] ?? "0");
  const totalCommission = affiliatesDetail?.sub_com;
  const totalPayment = previousMonthGap + extraTotal + totalCommission;
  tables.table2.footers.forEach((i, index) => {
    if (index === 0) {
      i.value = previousMonthGap;
    } else if (index === 1) {
      i.value = extraTotal;
    } else if (index === 2) {
      i.value = totalCommission;
    } else if (index === 3) {
      i.value = totalPayment;
    }
  });
  tables.table1.footers.forEach((i) => (i.value = affiliatesDetail.sub_com));
  tables.table2.data = [
    merchant,
    payments_paid?.extras.split("|")[1] ?? "",
    payments_paid?.extras
      ? formatPrice(parseFloat(payments_paid?.extras.split("|")[2] ?? "0"))
      : "",
    payments_paid?.extras.split("|")[3] ?? "",
    formatPrice(extraTotal),
  ];
  console.log(tables);
  console.log(tables.table1.data.length);

  return (
    <>
      <Document>
        <Page size="A4">
          <div style={styles.page}>
            <View style={styles.section}>
              <Image style={styles.img} src={"/img/aff.png"} />
            </View>
            <View style={styles.section}>
              <Heading
                style={styles.paymentForm}
                title="Affiliate Payment Form"
              />
              <HeaderInformation
                title="Payment #"
                value={payments_paid?.paymentID}
              />
              <HeaderInformation
                title="Month"
                value={`${payments_paid?.month}/${payments_paid?.year}`}
              />
            </View>
          </div>

          <div style={styles.borderSection}>
            <Text style={styles.borderLine}></Text>
          </div>
          <div style={styles.page}>
            <View style={styles.section}>
              <Heading title="Payable to :" />
              <HeaderInformation
                title="Payment Method:"
                value={affiliatesDetail?.paymentMethod}
              />
              <HeaderInformation
                title="Address:"
                value={affiliatesDetail?.pay_account}
              />
              <HeaderInformation
                title="Name:"
                value={affiliatesDetail?.pay_company}
              />
            </View>
            <View style={styles.section}>
              <Heading title="Affiliate Information:" />
              <HeaderInformation
                title="Affiliate #"
                value={String(affiliatesDetail?.id)}
              />
              <HeaderInformation
                title="Full Name:"
                value={`${affiliatesDetail?.first_name} ${affiliatesDetail?.last_name}`}
              />
              <HeaderInformation
                title="Username:"
                value={affiliatesDetail?.username}
              />
              <HeaderInformation
                title="Country:"
                value={affiliatesDetail?.country}
              />
              <HeaderInformation
                title="Phone:"
                value={affiliatesDetail?.phone}
              />
              <HeaderInformation
                title="Email:"
                value={affiliatesDetail?.mail}
              />
            </View>
          </div>
          <div style={styles.borderSection}>
            <Text style={styles.borderLine}></Text>
          </div>

          {/* //--------first table ------------- */}
          <View style={styles.section}>
            <div style={styles.page}>
              <View style={styles.CommissionSection}>
                <Heading
                  title="Commission payments"
                  style={styles.textMedium}
                />
              </View>
            </div>
            <Table
              data={tables.table1.data}
              columns={tables.table1.columns}
              footers={tables.table1.footers}
            />
            {/* //------second table-------- */}
            <div style={styles.page}>
              <View style={styles.ExtraSection}>
                <Heading title="Extra payments" style={styles.textMedium} />
              </View>
            </div>
            <Table
              data={tables.table2.data}
              columns={tables.table2.columns}
              footers={tables.table2.footers}
            />
            <div style={styles.page}>
              <View style={styles.section}>
                <Heading style={styles.textSmall} title="Transection ID" />
                <Heading
                  style={styles.textBold}
                  title={payments_paid?.transaction_id}
                />
              </View>
              <View style={styles.section}>
                <Heading style={styles.textSmall} title="Notes" />
                <Heading style={styles.textBold} title={payments_paid?.notes} />
              </View>
            </div>
            <div style={styles.page}>
              <View style={styles.section}>
                <Heading
                  style={styles.textLarge}
                  title={"Thank you for your business\nGamingAffiliates"}
                />
              </View>
            </div>
          </View>
        </Page>
      </Document>
    </>
  );
};
export default MyDocument;
