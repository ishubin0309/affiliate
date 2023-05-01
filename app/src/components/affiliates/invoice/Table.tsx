import { View } from "@react-pdf/renderer";
import { TableFooter } from "./TableFooter";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { styles } from "./styles";

interface footer {
  title: string;
  value: number;
}
interface tableData {
  merchant: string;
  deal: string;
  unitPrice: string;
  quantity: string;
  price: string;
}
interface TableProps {
  columns: string[];
  data?: tableData[];
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
      {data &&
        data.map((i: tableData, index: number) => (
          <View style={styles.tableRow} key={index}>
            {Object.keys(i).map((item) => (
              <TableRow
                key={index}
                data={i[item as keyof tableData]}
                columns={columns.length}
              />
            ))}
          </View>
        ))}
      {footers.map((i: footer, index: number) => (
        <View style={styles.tableRow} key={index}>
          <TableFooter
            title={i.title}
            value={i.value}
            columnLength={columns.length}
          />
        </View>
      ))}
    </View>
  </>
);
