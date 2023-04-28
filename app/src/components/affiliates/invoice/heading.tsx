import { Text } from "@react-pdf/renderer";
import { styles } from "./styles";
interface HeaderProps {
  title: string;
  style?: object;
}
export const Heading = ({ title, style }: HeaderProps) => (
  <Text style={style ? style : styles.textHeading}>{title}</Text>
);
