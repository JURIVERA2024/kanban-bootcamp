import { Card } from "./card";
import { Check, Plus } from "lucide-react";

const styleMenu = {
  width: "160px",
  height: "200px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "left" as const,
};

const styleColumn = {
  width: "145px",
  height: "auto",
  display: "flex",
  flexDirection: "row" as const,
  gap: "8px",
  alignItems: "center" as const,
  justifyContent: "left" as const,
  paddingLeft: "10px",
  fontSize: "14px",
};

type MenuColumnProps = {
  visible?: boolean;
};

export function MenuColumn({ visible = true }: MenuColumnProps) {
  return (
    <Card
      id="columnCreationForm"
      style={{
        ...styleMenu,
        display: visible ? "flex" : "none",
      }}
      className="p-2 absolute top-2  right-14 bottom-0"
    >
      <span className="flex flex-row items-center gap-1 w-full h-10 cursor-pointer  text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md p-1  hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 ">
        <Plus size={16} color="gray" /> New column
      </span>
      <span className="border-b border-gray-400"></span>
      <span className="text-sm text-gray-500 dark:text-gray-400 cursor-info">
        visible Columns
      </span>

      <span
        style={styleColumn}
        className="cursor-pointer hover:text-blue-500 hover:bg-gray-100 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-md p-1 transition-colors duration-200"
      >
        <Check size={14} color="gray" /> To do
      </span>
      <span
        style={styleColumn}
        className="cursor-pointer hover:text-blue-500 hover:bg-gray-100 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-md p-1 transition-colors duration-200"
      >
        <Check size={14} color="gray" /> In progress
      </span>
      <span
        style={styleColumn}
        className="cursor-pointer hover:text-blue-500 hover:bg-gray-100 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-md p-1 transition-colors duration-200"
      >
        <Check size={14} color="gray" /> Done
      </span>

      <span className="text-sm text-gray-500 dark:text-gray-400 cursor-info">
        hidden Columns
      </span>
    </Card>
  );
}
