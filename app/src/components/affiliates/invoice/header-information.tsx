import { Heading } from "./heading";
import { styles } from "./styles";
interface HeaderInformationProps {
  title: string;
  value: string;
}
export const HeaderInformation = ({ title, value }: HeaderInformationProps) => (
  <div style={styles.flexDiv}>
    <Heading style={styles.textSmall} title={title} />
    <Heading style={styles.textBold} title={value} />
  </div>
);
