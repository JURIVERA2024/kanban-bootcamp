import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical, Pencil, Calendar, Tag } from "lucide-react";
import { useState } from "react";
import { EditTaskDialog } from "./EditTaskDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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

// Mapeo de tipos a emojis
const typeEmojis: Record<string, string> = {
	bug: "🐛",
	feature: "✨",
	improvement: "⚡",
	documentation: "📚",
	question: "❓"
};

// Mapeo de prioridades a colores
const priorityColors: Record<string, string> = {
	baja: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
	media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
	alta: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
	urgente: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
};

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

	const formatDate = (dateString?: string) => {
		if (!dateString) return null;
		const date = new Date(dateString);
		return date.toLocaleDateString();
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

				{/* Contenido con ambas áreas: arrastrable y no arrastrable */}
				<CardContent className="px-3 pt-2 pb-3">
					<div className="space-y-2">
						{/* Título NO arrastrable - es clickable */}
						<div className="flex flex-row justify-between w-auto">
							<button
								onClick={() => setIsEditDialogOpen(true)}
								className="text-sm font-medium line-clamp-2 text-left hover:text-primary hover:underline cursor-pointer transition-colors"
							>
								{task.title}
							</button>
							{/* Asignados */}
							{task.assignees && task.assignees.length > 0 && (
								<div className="flex -space-x-2 overflow-hidden mt-2">
									{task.assignees.slice(0, 3).map((assignee) => (
										<Avatar key={assignee.id} className="h-6 w-6 border-2 border-white dark:border-gray-800">
											<AvatarImage src={assignee.avatar} alt={assignee.name} />
											<AvatarFallback>{assignee.name.substring(0, 2)}</AvatarFallback>
										</Avatar>
									))}
									{task.assignees.length > 3 && (
										<div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-800 dark:text-gray-200 border-2 border-white dark:border-gray-800">
											+{task.assignees.length - 3}
										</div>
									)}
								</div>
							)}
						</div>

						{/* Resto del contenido arrastrable */}
						<div
							{...attributes}
							{...listeners}
							className="cursor-grab active:cursor-grabbing"
						>
							{/* Metadatos inferiores */}
							<div className="flex flex-wrap items-center gap-2 pt-1">
								{/* Prioridad */}
								{task.priority && (
									<span className={`text-xs px-1.5 py-0.5 rounded-full ${priorityColors[task.priority] || "bg-gray-100"}`}>
										{task.priority}
									</span>
								)}

								{/* Fecha límite */}
								{task.dueDate && (
									<div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
										<Calendar className="h-3 w-3 mr-1" />
										{formatDate(task.dueDate)}
									</div>
								)}

								{/* Etiquetas (mostrar solo la primera) */}
								{task.tags && task.tags.length > 0 && (
									<div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
										<Tag className="h-3 w-3 mr-1" />
										{task.tags[0]}
										{task.tags.length > 1 && <span className="ml-1">+{task.tags.length - 1}</span>}
									</div>
								)}
								{/* Comentarios count */}
								{task.comments && task.comments.length > 0 && (
									<div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
										<span className="flex items-center">
											💬 {task.comments.length}
										</span>
									</div>
								)}
							</div>

						</div>
					</div>
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
