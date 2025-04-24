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
  
  export function TagColumn({ title, color = "text-gray-500", isVisible = true }: TagColumnProps) {
    return (
      <span
        style={styleColumn}
        className={`flex-grow truncate ${isVisible 
          ? "text-gray-700 dark:text-gray-300" 
          : "text-gray-500 dark:text-gray-500 italic"} 
        hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-1 transition-colors duration-200`}
      >
        <Check size={14} className={color} /> {title}
      </span>
    );
  }
  
  