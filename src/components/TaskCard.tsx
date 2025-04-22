import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { EditTaskDialog } from "./EditTaskDialog";

export interface Task {
	id: UniqueIdentifier;
	columnId: UniqueIdentifier;
	content: string;
	title?: string;
	description?: string;
	priority?: string;
	dueDate?: string;
	tags?: string[];
	assignees?: { id: string; name: string; avatar: string }[];
	creator?: { id: string; name: string; avatar: string };
	type?: "bug" | "feature" | "improvement" | "documentation" | "question";
	project?: string;
	participants?: { id: string; name: string; avatar: string }[];
	createdAt?: string;
	updatedAt?: string;
	comments?: { id: string; author: { id: string; name: string; avatar: string }; content: string; createdAt: string }[];
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
	const [isDragStarted, setIsDragStarted] = useState(false);

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

	const variants = cva("cursor-grab active:cursor-grabbing", {
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
				{...attributes}
				{...listeners}
				className={variants({
					dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
				})}
			>
				<CardContent className="px-3 py-3 text-left whitespace-pre-wrap">
					<button
						className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition-colors "
						onClick={(e) => {
							// Evitar que el click para editar interfiera con el drag
							e.stopPropagation();
							setIsEditDialogOpen(true);
						}}
					>
						{task.title}
					</button>
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
