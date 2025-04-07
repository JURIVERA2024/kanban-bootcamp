import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { Task, TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { GripVertical, Plus } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { MenuColumn } from "./ui/menuColumn";

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
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
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

  const progresColor = {
    "In progress": "text-yellow-400",
    "Done": "text-green-400",
    "ToDo": "text-red-400",
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-center flex flex-row items-center justify-between">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <GripVertical />
        </Button>
        {
          column.title === "Done" ? <span className={`text-center ${progresColor["Done"]}`} > {column.title}</span> : 
          column.title === "In progress" ? <span className={`text-center ${progresColor["In progress"]}`} > {column.title}</span> : 
          column.title === "To do" ? <span className={`text-center ${progresColor["ToDo"]}`} > {column.title}</span> : 
          <span className={`text-center`} > {column.title}</span>
        } 
        <Button
          variant={"outline"}
          className="h-6 py-0 px-0 w-6 text-center justify-center items-center cursor-pointer"
        >
          <Plus/>
        </Button>

      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
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

  return (
    <div className="flex">
      <ScrollArea
        className={variations({
          dragging: dndContext.active ? "active" : "default",
        })}
      >
        <div className="flex gap-4 items-center flex-row justify-center">
          {children}
          <Button variant={"outline"} size={"icon"}>
            <Plus/>
          </Button>
          <MenuColumn visible={false}/>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
    </div>
  );
}
