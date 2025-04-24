import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useRef, useState } from "react";
import { Task, TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { GripVertical, Plus, Circle, MoreVertical, EyeOff, Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { MenuColumn } from "./ui/menuColumn";
import { ColumnProps } from "@/types/types";
import { EditTaskDialog } from "./EditTaskDialog";
import { v4 as uuidv4 } from 'uuid';
import { useKanbanContext } from "@/context/kanbanContext";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: ColumnProps;
  tasks: Task[];
  isOverlay?: boolean;
  onTaskUpdate?: (updatedTask: Task) => void;
}

export function BoardColumn({ column, tasks, isOverlay, onTaskUpdate }: BoardColumnProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { updateColumn, deleteColumn } = useKanbanContext();
  
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-[500px] max-h-[500px] w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  const handlePlusClick = () => {
    setIsDialogOpen(true);
  };

  const handleSave = (updatedTask: Task) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
    setIsDialogOpen(false);
  };

  const newTask: Task = {
    id: uuidv4(),
    columnId: column.id,
    content: "",
  };

  const getColorValue = (colorClass: string | undefined) => {
    if (!colorClass) return 'rgb(107, 114, 128)'; // gray-500
    
    // Mapeo de clases de Tailwind a valores RGB
    const colorMap: Record<string, string> = {
      'text-black': 'rgb(0, 0, 0)',
      'text-white': 'rgb(255, 255, 255)',
      'text-red-500': 'rgb(239, 68, 68)',
      'text-blue-500': 'rgb(59, 130, 246)',
      'text-green-500': 'rgb(34, 197, 94)',
      'text-yellow-500': 'rgb(234, 179, 8)',
      'text-violet-500': 'rgb(139, 92, 246)',
      'text-red-400': 'rgb(248, 113, 113)',
      'text-yellow-400': 'rgb(250, 204, 21)',
      'text-green-400': 'rgb(74, 222, 128)'
    };
    
    return colorMap[colorClass] || 'rgb(107, 114, 128)';
  };

  // Función para ocultar la columna
  const handleHideColumn = () => {
    updateColumn(column.id, { isVisible: false });
    setIsMenuOpen(false);
  };

  // Función para eliminar la columna
  const handleDeleteColumn = () => {
    deleteColumn(column.id);
    setIsMenuOpen(false);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-center flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 !m-0">
          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
          >
            <span className="sr-only">{`Move column: ${column.title}`}</span>
            <GripVertical />
          </Button>

          <div className="relative flex items-center justify-center w-6 h-6">
            <div 
              className="absolute inset-0 rounded-full" 
              style={{ 
                backgroundColor: getColorValue(column.color),
                opacity: 0.6
              }}
            ></div>
            <Circle className="relative z-9 w-5 h-5 text-white" />
          </div>
          <span className="text-center font-medium">{column.title}</span>
        </div>

        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleHideColumn}
                >
                  <EyeOff className="mr-2 h-4 w-4" />
                  Ocultar columna
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleDeleteColumn}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar columna
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Diálogo de edición de tarea (oculto visualmente pero activo para su uso) */}
        <div className="hidden">
          <EditTaskDialog
            task={newTask}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSave={handleSave}
          />
        </div>
      </CardHeader>
      <div className="flex flex-col flex-grow overflow-hidden">
        <ScrollArea className="flex-grow">
          <CardContent className="flex flex-col gap-2 p-2">
            <SortableContext items={tasksIds}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onTaskUpdate={onTaskUpdate}
                />
              ))}
            </SortableContext>
          </CardContent>
        </ScrollArea>
        <CardFooter className="flex justify-center p-2 border-t mt-auto bg-card">
          <Button 
            variant={"ghost"} 
            size={"sm"} 
            onClick={handlePlusClick} 
            className="w-full flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus size={16} />
            <span>Añadir tarea</span>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handlePlusClick = () => {
    setIsFormVisible(true);
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.id !== "columnCreationForm" &&
        !event.target.closest("#columnCreationForm")
      ) {
        setIsFormVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-items-center justify-center">
      <ScrollArea
        className={variations({
          dragging: dndContext.active ? "active" : "default",
        })}
      >
        <div className="flex gap-4 justify-items-start flex-row">
          {children}
          <Button variant={"outline"} size={"icon"} onClick={handlePlusClick} className="h-8 py-0 px-0 w-8  text-center justify-center items-center cursor-pointer">
            <Plus />
          </Button>
          <MenuColumn visible={isFormVisible} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

    </div>
  );
}
