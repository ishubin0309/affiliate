import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatPrice } from "../../../utils/format";
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  CommissionSection: {
    fontSize: 12,
    paddingBottom: 4,
    flexGrow: 1,
  },
  ExtraSection: {
    fontSize: 12,
    paddingBottom: 4,
    paddingTop: 12,
    flexGrow: 1,
  },
  textSmall: {
    fontSize: 10,
    color: "#948f8f",
  },
  textMedium: {
    fontSize: 12,
    color: "#666666",
  },
  textLarge: {
    fontSize: 20,
    color: "#948f8f",
  },
  textBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
  },
  // for table 1
  table1: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow1: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol1: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeadingCol1: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#C9C9C9",
  },
  tableCol751: {
    width: "75%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell1: {
    margin: "auto",
    marginTop: 3,
    fontSize: 10,
  },
  // for table 2
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeadingCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#C9C9C9",
  },
  tableCol75: {
    width: "80%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 3,
    fontSize: 10,
  },
  tableCell75: {
    width: "auto",
    marginLeft: "auto",
    paddingRight: 3,
    marginTop: 3,
    fontSize: 10,
  },
  img: {
    width: 200,
  },
  borderSection: {
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  borderLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#c9c9c9",
  },
  paymentForm: {
    fontSize: 22,
    color: "#666666",
    fontWeight: 800,
  },
});
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
  return (
    <>
      <Document>
        <Page size="A4">
          <div style={styles.page}>
            <View style={styles.section}>
              <Image style={styles.img} src={"/img/aff.png"} />
            </View>
            <View style={styles.section}>
              <Text style={styles.paymentForm}>Affiliate Payment Form </Text>
              <Text style={styles.textSmall}>
                payment #{" "}
                <Text style={styles.textBold}>{payments_paid?.paymentID}</Text>{" "}
              </Text>
              <Text style={styles.textSmall}>
                Month{" "}
                <Text style={styles.textBold}>
                  {payments_paid?.month}/{payments_paid?.year}
                </Text>
              </Text>
            </View>
          </div>

          <div style={styles.borderSection}>
            <Text style={styles.borderLine}></Text>
          </div>

          <div style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.textSmall}>
                Payable to :<Text style={styles.textBold}></Text>{" "}
              </Text>
              <Text style={styles.textSmall}>
                Payment Method:
                <Text style={styles.textBold}>
                  {affiliatesDetail?.paymentMethod}
                </Text>
              </Text>
              <Text style={styles.textSmall}>
                Address:
                <Text style={styles.textBold}>
                  {affiliatesDetail?.pay_account}
                </Text>
              </Text>
              <Text style={styles.textSmall}>
                Name:
                <Text style={styles.textBold}>
                  {affiliatesDetail?.pay_company}
                </Text>{" "}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.textSmall}>
                Affiliate Information: <Text style={styles.textBold}> </Text>{" "}
              </Text>
              <Text style={styles.textSmall}>
                Affiliate #{" "}
                <Text style={styles.textBold}>{affiliatesDetail?.id}</Text>{" "}
              </Text>
              <Text style={styles.textSmall}>
                Full Name:
                <Text style={styles.textBold}>
                  {" "}
                  {affiliatesDetail?.first_name} {affiliatesDetail?.last_name}
                </Text>{" "}
              </Text>
              <Text style={styles.textSmall}>
                Username:
                <Text style={styles.textBold}>
                  {affiliatesDetail?.username}
                </Text>{" "}
              </Text>
              <Text style={styles.textSmall}>
                Country:
                <Text style={styles.textBold}>
                  {affiliatesDetail?.country}
                </Text>{" "}
              </Text>
              <Text style={styles.textSmall}>
                Phone:
                <Text style={styles.textBold}>
                  {affiliatesDetail?.phone}
                </Text>{" "}
              </Text>
              <Text style={styles.textSmall}>
                Email:
                <Text style={styles.textBold}>
                  {affiliatesDetail?.mail}{" "}
                </Text>{" "}
              </Text>
            </View>
          </div>
          <div style={styles.borderSection}>
            <Text style={styles.borderLine}></Text>
          </div>

          {/* //--------first table ------------- */}
          <View style={styles.section}>
            <div style={styles.page}>
              <View style={styles.CommissionSection}>
                <Text style={styles.textMedium}>Commission payments</Text>
              </View>
            </div>

            <View style={styles.table1}>
              <View style={styles.tableRow1}>
                <View style={styles.tableHeadingCol1}>
                  <Text style={styles.tableCell1}>Merchant</Text>
                </View>
                <View style={styles.tableHeadingCol1}>
                  <Text style={styles.tableCell1}>Deal Type</Text>
                </View>
                <View style={styles.tableHeadingCol1}>
                  <Text style={styles.tableCell1}>Quantity</Text>
                </View>
                <View style={styles.tableHeadingCol1}>
                  <Text style={styles.tableCell1}>Total Price</Text>
                </View>
              </View>
              {affiliatesDetail?.sub_com && affiliatesDetail?.sub_com > 0 && (
                <View style={styles.tableRow1}>
                  <View style={styles.tableCol1}>
                    <Text style={styles.tableCell1}>React-PDF</Text>
                  </View>
                  <View style={styles.tableCol1}>
                    <Text style={styles.tableCell1}>3 User </Text>
                  </View>
                  <View style={styles.tableCol1}>
                    <Text style={styles.tableCell1}>
                      2019-02-20 - 2020-02-19
                    </Text>
                  </View>
                  <View style={styles.tableCol1}>
                    <Text style={styles.tableCell1}>5€</Text>
                  </View>
                </View>
              )}
              <View style={styles.tableRow1}>
                <View style={styles.tableCol751}>
                  <Text style={styles.tableCell75}>Sub Total</Text>
                </View>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell1}>
                    {formatPrice(affiliatesDetail?.sub_com)}
                  </Text>
                </View>
              </View>
            </View>

            {/* //------second table-------- */}
            <div style={styles.page}>
              <View style={styles.ExtraSection}>
                <Text style={styles.textMedium}>Extra payments</Text>
              </View>
            </div>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableHeadingCol}>
                  <Text style={styles.tableCell}>Merchant</Text>
                </View>
                <View style={styles.tableHeadingCol}>
                  <Text style={styles.tableCell}>Deal</Text>
                </View>
                <View style={styles.tableHeadingCol}>
                  <Text style={styles.tableCell}>Unit Price</Text>
                </View>
                <View style={styles.tableHeadingCol}>
                  <Text style={styles.tableCell}>Quantity</Text>
                </View>
                <View style={styles.tableHeadingCol}>
                  <Text style={styles.tableCell}>Price</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{merchant}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {payments_paid?.extras
                      ? payments_paid?.extras.split("|")[1]
                      : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {payments_paid?.extras
                      ? formatPrice(
                          parseFloat(payments_paid?.extras.split("|")[2] ?? "0")
                        )
                      : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {payments_paid?.extras
                      ? payments_paid?.extras.split("|")[3]
                      : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {formatPrice(extraTotal)}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol75}>
                  <Text style={styles.tableCell75}>
                    Gap from Previous month
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {formatPrice(previousMonthGap)}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol75}>
                  <Text style={styles.tableCell75}>Extra Total</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {formatPrice(extraTotal)}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol75}>
                  <Text style={styles.tableCell75}>Commission Total</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {formatPrice(totalCommission)}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCol75}>
                  <Text style={styles.tableCell75}>Total Payment</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {formatPrice(totalPayment)}
                  </Text>
                </View>
              </View>
            </View>

            <div style={styles.page}>
              <View style={styles.section}>
                <Text style={styles.textSmall}>Transection ID </Text>
                <Text style={styles.textBold}>
                  {payments_paid?.transaction_id}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.textSmall}>Notes</Text>
                <Text style={styles.textBold}>{payments_paid?.notes}</Text>
              </View>
            </div>
            <div style={styles.page}>
              <View style={styles.section}>
                <Text style={styles.textLarge}>
                  {"Thank you for your business\nGamingAffiliates"}
                </Text>
              </View>
            </div>
          </View>
        </Page>
      </Document>
    </>
  );
};
export default MyDocument;
