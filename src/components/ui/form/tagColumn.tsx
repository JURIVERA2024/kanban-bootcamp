import { Check } from "lucide-react";

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
  
  type TagColumnProps = {
    title: string;
    color?: string;
    isVisible?: boolean;
  };
  
  export function TagColumn({ title, color = "gray", isVisible = true }: TagColumnProps) {
    if (!isVisible) return null;
  
    return (
      <span
        style={styleColumn}
        className="cursor-pointer hover:text-blue-500 hover:bg-gray-100 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-md p-1 transition-colors duration-200"
      >
        <Check size={14} color={color} /> {title}
      </span>
    );
  }
  
  