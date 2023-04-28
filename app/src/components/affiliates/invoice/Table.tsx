import { View } from "@react-pdf/renderer";
import { TableFooter } from "./TableFooter";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { styles } from "./styles";

interface footer {
  title: string;
  value: number;
}
interface TableProps {
  columns: string[];
  data: string[];
  footers: footer[];
}
export const Table = ({ columns, data, footers }: TableProps) => (
  <>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        {columns.map((i: string, index: number) => (
          <TableHeader columnName={i} key={index} columns={columns.length} />
        ))}
      </View>
      <View style={styles.tableRow}>
        {data.map((i: string, index: number) => (
          <TableRow data={i} key={index} columns={columns.length} />
        ))}
      </View>
      {footers.map((i: footer, index: number) => (
        <View style={styles.tableRow} key={index}>
          <TableFooter title={i.title} value={i.value} />
        </View>
      ))}
    </View>
  </>
);
