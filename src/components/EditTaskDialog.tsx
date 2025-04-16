import { useState } from "react";
import { Task } from "./TaskCard";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { AlertCircle, CalendarIcon, Tags } from "lucide-react";

interface EditTaskDialogProps {
    task: Task;
	onSave: (updatedTask: Task) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ task, onSave, open, onOpenChange }: EditTaskDialogProps) {
	const [content, setContent] = useState(task.content);
	const [title, setTitle] = useState(task.title || "");
	const [description, setDescription] = useState(task.description || "");
	const [priority, setPriority] = useState(task.priority || "media");
	const [dueDate, setDueDate] = useState(task.dueDate || "");
	const [tags, setTags] = useState(task.tags || []);
	const [newTag, setNewTag] = useState("");

	const handleSave = () => {
		onSave({
			...task,
			content,
			title,
			description,
			priority,
			dueDate,
			tags
		});
		onOpenChange(false);
	};

	const addTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter(tag => tag !== tagToRemove));
	}

    return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
				<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-[90vw] max-w-2x1 max-h-[85vh] overflow-y-auto">
					<Dialog.Title className="text-2x1 font-bold mb-6">Editar Tarea</Dialog.Title>

					<div className="space-y-6">
						<div>
							<label htmlFor="title" className="block text-sm font-medium mb-2">
								Título
							</label>
							<input
								id="task-title"
								className="w-full p-3 border-gray-300 rounded-md"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Título de la tarea"
							/>
						</div>

						<div>
							<label htmlFor="content" className="block text-sm font-medium mb-2">
								Contenido
							</label>
							<textarea
								id="task-content"
								className="w-full p-3 border-gray-300 rounded-md"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder="Contenido breve de la tarea"
								rows={3}
							/>
						</div>

						<div>
							<label htmlFor="description" className="block text-sm font-medium mb-2">
								Descripción Detallada
							</label>
							<textarea
								id="task-description"
								className="w-full p-3 border-gray-300 rounded-md"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Descripción detallada de la tarea, pasos a seguir, recursos necesarios, etc."
								rows={8}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor="priority" className="block text-sm font-medium mb-2">
									<AlertCircle className="h-4 w-4" />
									Prioridad
								</label>
								<select
									id="task-priority"
									className="w-full p-3 border border-gray-300 rounded-md"
									value={priority}
									onChange={(e) => setPriority(e.target.value)}
								>
									<option value="baja">Baja</option>
									<option value="media">Media</option>
									<option value="alta">Alta</option>
									<option value="urgente">Urgente</option>
								</select>
							</div>

							<div>
								<label htmlFor="dueDate" className="flex items-center gap-2 text-sm font-medium mb-2">
									<CalendarIcon className="h-4 w-4" />
									Fecha de Vencimiento
								</label>
								<div className="flex gap-2">
									<input
										id="task-dueDate"
										className="w-full p-3 border border-gray-300 rounded-md"
										value={dueDate}
										onChange={(e) => setDueDate(e.target.value)}
									/>
								</div>
							</div>
						</div>

						<div>
							<label htmlFor="tags" className="flex irems-center gap-2 text-sm font-medium mb-2">
								<Tags className="h-4 w-4" />
								Etiquetas
							</label>
							<div className="flex gap-2 mb-2">
								<input
									id="task-tag"
									className="flex-1 p-3 border border-gray-300 rounded-md"
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									placeholder="Añadir etiqueta"
									onKeyDown={(e) => e.key === "Enter" && addTag()}
								/>
								<Button onClick={addTag}>
									Añadir
								</Button>
							</div>
							<div className="flex flex-wrap gap-2 mt-2">
								{tags.map((tag, index) => (
									<div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
										{tag}
										<button
											onClick={() => removeTag(tag)}
											className="ml-1 text-gray-500 hover:text-gray-500"
										>
											×
										</button>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="mt-8 flex justify-end space-x-3">
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancelar
						</Button>
						<Button onClick={handleSave}>
							Guardar Cambios
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
    );
}
