import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical, Pencil } from "lucide-react";
import { useState } from "react";
import { EditTaskDialog } from "./EditTaskDialog";

export interface Task {
	id: UniqueIdentifier;
	columnId: UniqueIdentifier;
	content: string;
}

interface TaskCardProps {
	task: Task;
	isOverlay?: boolean;
	onTaskUpdate?: (updatedTask: Task) => void;
}

export type TaskType = "Task";

export interface TaskDragData {
	type: TaskType;
	task: Task;
}

export function TaskCard({ task, isOverlay, onTaskUpdate }: TaskCardProps) {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: "Task",
			task,
		} satisfies TaskDragData,
		attributes: {
			roleDescription: "Task",
		},
	});

	const style = {
		transition,
		transform: CSS.Translate.toString(transform),
	};

	const variants = cva("", {
		variants: {
			dragging: {
				over: "ring-2 opacity-30",
				overlay: "ring-2 ring-primary",
			},
		},
	});

	const handleTaskUpdate = (updatedTask: Task) => {
		if (onTaskUpdate) {
			onTaskUpdate(updatedTask);
		}
	};

	return (
		<>
			<Card
				ref={setNodeRef}
				style={style}
				className={variants({
					dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
				})}
			>
				<CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
					<Button
						variant={"ghost"}
						{...attributes}
						{...listeners}
						className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
					>
						<span className="sr-only">Move task</span>
						<GripVertical />
					</Button>
					<div className="flex items-center ml-auto gap-2">
						<Button
							variant={"outline"}
							size={"sm"}
							onClick={() => setIsEditDialogOpen(true)}	
						>
							<Pencil className="h-4 w-4" />
							<span className="sr-only">Edit</span>
						</Button>
						<Button variant={"outline"} size={"sm"}>
							...
						</Button>
					</div>
				</CardHeader>
				<CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
					{task.content}
				</CardContent>
			</Card>

			<EditTaskDialog
				task={task}
				onSave={handleTaskUpdate}
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
			/>
		</>
	);
}
