import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "./BoardColumn";
import { TaskDragData } from "./TaskCard";
import { ColumnProps } from "@/types/types";
import { Column } from "./BoardColumn";

type DraggableData = ColumnDragData | TaskDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}

/**
 * Convierte un objeto Column a ColumnProps
 */
export function convertToColumnProps(column: any): ColumnProps {
  return {
    id: String(column.id),
    title: column.title || "",
    description: column.description || column.title || "",
    tasks: column.tasks || [],
    kanban_id: column.kanban_id || "default-kanban",
    isVisible: column.isVisible !== false
  };
}
