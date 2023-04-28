import { CalendarDatePicker } from "./date-input";

const meta = {
  component: CalendarDatePicker,
};

export default meta;

export const Default = {
  render: () => <CalendarDatePicker allowTyping={false} />,
};
export const WithTyping = {
  render: () => <CalendarDatePicker allowTyping={true} />,
};

// export const Error = {
//   render: () => <CalendarDatePicker error="Error" />,
// };
