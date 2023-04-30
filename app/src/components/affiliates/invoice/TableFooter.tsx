import { View } from "@react-pdf/renderer";
import { formatPrice } from "../../../utils/format";
import { Heading } from "./heading";
import { styles } from "./styles";
interface TableFooterProps {
  title: string;
  value: number;
}
export const TableFooter = ({ title, value }: TableFooterProps) => (
  <>
    <View style={styles.tableCol75}>
      <Heading style={styles.tableCell75} title={title} />
    </View>
    <View style={styles.tableCol}>
      <Heading style={styles.tableCell} title={formatPrice(value)} />
    </View>
  </>
);
