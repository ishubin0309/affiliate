import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

interface Props<Data extends object> {
  columns: ColumnDef<Data, any>[];
  selectColumnsMode: string[] | null;
  handleCheckboxChange: (fieldName: string, checked: boolean) => void;
}

const ColumnSelect = <Data extends object>({
  columns,
  selectColumnsMode,
  handleCheckboxChange,
}: Props<Data>) => {
  return (
    <div
      className={`mt-4 overflow-hidden transition-all duration-500	 ${
        selectColumnsMode ? "h-52 md:h-44 lg:h-36 xl:h-28" : "h-0"
      }`}
    >
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-white p-4 shadow-md md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
        {columns.map((item: any) => (
          <div className="flex items-center space-x-2" key={item.accessorKey}>
            <Checkbox
              className="mr-2 h-[18px] w-[18px] whitespace-nowrap"
              id={item.header}
              name={item.accessorKey}
              checked={selectColumnsMode?.includes(item.accessorKey)}
              onCheckedChange={(checked: boolean) => {
                handleCheckboxChange(item.accessorKey, checked);
              }}
            />
            <label
              htmlFor={item.header}
              className="cursor-pointer text-sm font-medium leading-none"
            >
              {item.header}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelect;
