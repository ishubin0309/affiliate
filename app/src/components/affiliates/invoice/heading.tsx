import { Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { isNumeric } from "@/utils/format";
import { keys } from "rambda";
interface HeaderProps {
  title: string;
  style?: object;
}
export const Heading = ({ title, style }: HeaderProps) => {
  let _style: object = style ? style : styles.textHeading;

  if (isNumeric(title) && !("paddingRight" in keys(_style))) {
    _style = { ..._style, paddingRight: "10px", textAlign: "right" };
  } else if (!isNumeric(title) && !("paddingLeft" in keys(_style))) {
    _style = { ..._style, paddingLeft: "10px" };
  }

  return <Text style={_style}>{title}</Text>;
};
