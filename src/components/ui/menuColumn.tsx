import {Card } from "./card";
import {Plus } from "lucide-react";
import {TagColumn } from "./form/tagColumn";
import { useKanbanContext } from "@/context/kanbanContext";
// import { useEffect } from "react";

const styleMenu = {
  width: "160px",
  height: "200px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "left" as const,
};

type MenuColumnProps = {
  visible?: boolean;
  title?: string;
  color?: string;
  isVisible?: boolean;
};

export function MenuColumn({ visible = true}: MenuColumnProps) { 

  const { columns } = useKanbanContext();
  

  // useEffect(() => {
  //   if (columns.length === 0) {

  //       createColumn({
  //         id: "1",
  //         title: "To do",
  //         description: "Initial test column",
  //         tasks: [],
  //         kanban_id: "demo-kanban-1",
  //       });

  //         createColumn({
  //         id: "2",
  //         title: "In progress",
  //         description: "Initial test column",
  //         tasks: [],
  //         kanban_id: "demo-kanban-1"
  //       });
        
  //   }
  // }, [columns, createColumn]);

  // console.log("columns", columns);

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
      {columns.map((column) => (
        <TagColumn
          key={column.id}
          title={column.title}
          color={column.color ?? "gray"}
          isVisible={true} // o puedes usar lógica para mostrar/ocultar según otro campo
        />
      ))}
       
      <span className="text-sm text-gray-500 dark:text-gray-400 cursor-info">
        hidden Columns
      </span>
    </Card>
  );
}
