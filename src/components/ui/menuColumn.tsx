import { Card } from "./card";
import { Plus, EyeOff, Eye } from "lucide-react";
import { TagColumn } from "./form/tagColumn";
import { useKanbanContext } from "@/context/kanbanContext";
import ColumnCreationForm from "./form/ColumnCreationForm";
import { useState } from "react";
// import { useEffect } from "react";

const styleMenu = {
  width: "220px",
  height: "300px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "left" as const,
  overflow: "auto",
  scrollbarWidth: "none" as any, // Firefox
  msOverflowStyle: "none" as any, // IE/Edge
  "&::-webkit-scrollbar": {
    display: "none" // Chrome/Safari/Opera
  }
};

type MenuColumnProps = {
  visible?: boolean;
};

export function MenuColumn({ visible = true }: MenuColumnProps) {
  const { columns, updateColumn } = useKanbanContext();
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Separar columnas visibles y ocultas
  const visibleColumns = columns.filter(column => column.isVisible !== false);
  const hiddenColumns = columns.filter(column => column.isVisible === false);

  // Función para cambiar la visibilidad de una columna
  const toggleColumnVisibility = (columnId: string, currentVisibility: boolean | undefined) => {
    updateColumn(columnId, { isVisible: !currentVisibility });
  };

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
        display: visible ? "flex" : "none"
      }}
      className="p-3 absolute top-2 right-14 bottom-0 flex flex-col gap-2"
    >
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="flex flex-row items-center gap-2 w-full h-10 cursor-pointer text-start text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md p-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
      >
        <Plus size={16} className="min-w-4" />
        <span>Nueva columna</span>
      </button>

      <ColumnCreationForm open={isFormVisible} onOpenChange={setIsFormVisible} />

      <div className="border-b border-gray-400 my-1"></div>
      
      {/* Sección de columnas visibles */}
      <div className="flex flex-col gap-1 w-full">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 pl-1">
          Columnas visibles
        </h3>
        
        {visibleColumns.length > 0 ? (
          <div className="flex flex-col gap-1">
            {visibleColumns.map((column) => (
              <div key={column.id} className="flex justify-between items-center w-full">
                <TagColumn
                  title={column.title}
                  color={column.color ?? "text-gray-500"}
                  isVisible={true}
                />
                <button 
                  onClick={() => toggleColumnVisibility(column.id, column.isVisible)}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Ocultar columna"
                >
                  <EyeOff size={16} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic pl-2">
            No hay columnas visibles
          </p>
        )}
      </div>

      <div className="border-b border-gray-400 my-1"></div>
      
      {/* Sección de columnas ocultas */}
      <div className="flex flex-col gap-1 w-full">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 pl-1">
          Columnas ocultas
        </h3>
        
        {hiddenColumns.length > 0 ? (
          <div className="flex flex-col gap-1">
            {hiddenColumns.map((column) => (
              <div key={column.id} className="flex justify-between items-center w-full">
                <TagColumn
                  title={column.title}
                  color={column.color ?? "text-gray-500"}
                  isVisible={false}
                />
                <button 
                  onClick={() => toggleColumnVisibility(column.id, column.isVisible)}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Mostrar columna"
                >
                  <Eye size={16} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic pl-2">
            No hay columnas ocultas
          </p>
        )}
      </div>
    </Card>
  );
}
