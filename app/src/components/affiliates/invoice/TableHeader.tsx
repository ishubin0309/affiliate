import { View } from "@react-pdf/renderer";
import { Heading } from "./heading";
import { styles } from "./styles";
interface TableHeaderProps {
  columnName: string;
  key: number;
  columns: number;
}
export const TableHeader = ({ columnName, key, columns }: TableHeaderProps) => (
  <>
    <View
      style={{
        ...styles.tableHeadingCol,
        width: `${100 / columns}%`,
      }}
      key={key}
    >
      <Heading style={styles.tableCell} title={columnName} />
    </View>
  </>
);
