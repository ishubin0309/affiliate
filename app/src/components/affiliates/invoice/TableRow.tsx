import { View } from "@react-pdf/renderer";
import { Heading } from "./heading";
import { styles } from "./styles";
interface TableRowProps {
  data: string;
  key: number;
  columns: number;
}
export const TableRow = ({ data, key, columns }: TableRowProps) => (
  <View
    key={key}
    style={{
      ...styles.tableCol,
      width: `${100 / columns}%`,
    }}
  >
    <Heading style={styles.tableCell} title={data} />
  </View>
);
