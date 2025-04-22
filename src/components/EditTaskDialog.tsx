import { useState } from "react";
import { Task } from "./TaskCard";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { AlertCircle, CalendarIcon, Tags, Users, User, MessageSquare, GitBranch, Package, Plus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


interface EditTaskDialogProps {
    task: Task;
	onSave: (updatedTask: Task) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// Datos de ejemplo para simular usuarios
const sampleUsers = [
	{ id: "1", name: "John Doe", avatar: "https://github.com/shadcn.png" },
	{ id: "2", name: "Jane Smith", avatar: "https://github.com/vercel.png" },
	{ id: "3", name: "Bob Johnson", avatar: "https://avatars.githubusercontent.com/u/1234567" },
];

// Proyectos de ejemplo
const sampleProjects = ["Frontend", "Backend", "API", "Documentation", "DevOps"];

export function EditTaskDialog({ task, onSave, open, onOpenChange }: EditTaskDialogProps) {
	const [content, setContent] = useState(task.content);
	const [title, setTitle] = useState(task.title || "");
	const [description, setDescription] = useState(task.description || "");
	const [priority, setPriority] = useState(task.priority || "media");
	const [dueDate, setDueDate] = useState(task.dueDate || "");
	const [tags, setTags] = useState(task.tags || []);
	const [newTag, setNewTag] = useState("");
	const [type, setType] = useState(task.type || "feature");
	const [project, setProject] = useState(task.project || "");
	const [assignees, setAssignees] = useState(task.assignees || []);
	const [comment, setComment] = useState("");
	
	// Establecer creador si no existe
	const creator = task.creator || sampleUsers[0];

	const handleSave = () => {
		onSave({
			...task,
			content,
			title,
			description,
			priority,
			dueDate,
			tags,
			type,
			project,
			assignees,
			creator,
			updatedAt: new Date().toISOString(),
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

	const toggleAssignee = (user: typeof sampleUsers[0]) => {
		const isAssigned = assignees.some(a => a.id === user.id);
		if (isAssigned) {
			setAssignees(assignees.filter(a => a.id !== user.id));
		} else {
			setAssignees([...assignees, user]);
		}
	}

	const addComment = () => {
		if (!comment.trim() || !task.comments) return;
		
		const newComment = {
			id: Math.random().toString(),
			author: sampleUsers[0],
			content: comment,
			createdAt: new Date().toISOString()
		};
		
		onSave({
			...task,
			comments: [...(task.comments || []), newComment]
		});
		
		setComment("");
	}

    return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut" />
				<Dialog.Content className="fixed top-0 right-0 h-full w-[90%] bg-white dark:bg-gray-800 p-8 shadow-lg overflow-y-auto dark:text-gray-100 data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut">
					<div className="max-w-4xl mx-auto">
						<div className="flex justify-between items-start mb-6">
							<div className="flex items-center gap-2">
								{task.id && <span className="text-gray-500">#{String(task.id).substring(0, 6)}</span>}
								<Dialog.Title className="text-2xl font-semibold dark:text-gray-50">
									<input
										className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none py-1 text-2xl font-semibold"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Título de la tarea"
									/>
								</Dialog.Title>
							</div>
							<Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
								<X className="h-5 w-5" />
							</Button>
						</div>

						<div className="grid grid-cols-3 gap-8">
							{/* Columna principal */}
							<div className="col-span-2 space-y-6">
								{/* Creador */}
								<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
									<Avatar className="h-5 w-5">
										<AvatarImage src={creator.avatar} alt={creator.name} />
										<AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
									</Avatar>
									<span>{creator.name}</span> creó esta tarea
								</div>

								{/* Descripción */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700">
										Descripción
									</div>
									<div className="p-4">
										<textarea
											className="w-full min-h-[200px] p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white resize-y"
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											placeholder="Añade una descripción detallada..."
										/>
									</div>
								</div>

								{/* Contenido breve */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700">
										Contenido breve
									</div>
									<div className="p-4">
										<textarea
											className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
											value={content}
											onChange={(e) => setContent(e.target.value)}
											placeholder="Contenido breve de la tarea"
											rows={3}
										/>
									</div>
								</div>

								{/* Comentarios */}
								{task.comments && task.comments.length > 0 && (
									<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
										<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700">
											Comentarios ({task.comments.length})
										</div>
										<div className="p-4 space-y-4">
											{task.comments.map(comment => (
												<div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
													<div className="flex items-center gap-2 mb-2">
														<Avatar className="h-6 w-6">
															<AvatarImage src={comment.author.avatar} alt={comment.author.name} />
															<AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
														</Avatar>
														<span className="font-medium">{comment.author.name}</span>
														<span className="text-xs text-gray-500">
															{new Date(comment.createdAt).toLocaleDateString()}
														</span>
													</div>
													<p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Añadir comentario */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700">
										Añadir comentario
									</div>
									<div className="p-4">
										<textarea
											className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
											value={comment}
											onChange={(e) => setComment(e.target.value)}
											placeholder="Añade un comentario..."
											rows={3}
										/>
										<div className="flex justify-end mt-2">
											<Button onClick={addComment}>
												Comentar
											</Button>
										</div>
									</div>
								</div>
							</div>

							{/* Barra lateral */}
							<div className="col-span-1 space-y-6">
								{/* Asignados */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4" />
											Asignados
										</div>
										<button className="text-blue-500 hover:text-blue-700 text-sm">
											<Plus className="h-4 w-4" />
										</button>
									</div>
									<div className="p-4">
										<div className="space-y-2">
											{sampleUsers.map(user => (
												<div key={user.id} className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Avatar className="h-6 w-6">
															<AvatarImage src={user.avatar} alt={user.name} />
															<AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
														</Avatar>
														<span>{user.name}</span>
													</div>
													<input 
														type="checkbox" 
														checked={assignees.some(a => a.id === user.id)}
														onChange={() => toggleAssignee(user)}
														className="accent-blue-500"
													/>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Etiquetas */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
										<Tags className="h-4 w-4" />
										Etiquetas
									</div>
									<div className="p-4">
										<div className="flex gap-2 mb-2">
											<input
												className="flex-1 p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
												value={newTag}
												onChange={(e) => setNewTag(e.target.value)}
												placeholder="Añadir etiqueta"
												onKeyDown={(e) => e.key === "Enter" && addTag()}
											/>
											<Button size="sm" onClick={addTag}>
												Añadir
											</Button>
										</div>
										<div className="flex flex-wrap gap-2 mt-2">
											{tags.map((tag, index) => (
												<div key={index} className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full flex items-center gap-1 text-xs text-blue-800 dark:text-blue-100">
													{tag}
													<button
														onClick={() => removeTag(tag)}
														className="ml-1 text-blue-500 hover:text-blue-700"
													>
														×
													</button>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Tipo */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
										<AlertCircle className="h-4 w-4" />
										Tipo
									</div>
									<div className="p-4">
										<select
											className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
											value={type}
											onChange={(e) => setType(e.target.value as any)}
										>
											<option value="bug">🐛 Bug</option>
											<option value="feature">✨ Feature</option>
											<option value="improvement">⚡ Improvement</option>
											<option value="documentation">📚 Documentation</option>
											<option value="question">❓ Question</option>
										</select>
									</div>
								</div>

								{/* Proyecto */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
										<Package className="h-4 w-4" />
										Proyecto
									</div>
									<div className="p-4">
										<select
											className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
											value={project}
											onChange={(e) => setProject(e.target.value)}
										>
											<option value="">Ninguno</option>
											{sampleProjects.map(proj => (
												<option key={proj} value={proj}>{proj}</option>
											))}
										</select>
									</div>
								</div>

								{/* Prioridad */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
										<AlertCircle className="h-4 w-4" />
										Prioridad
									</div>
									<div className="p-4">
										<select
											className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
											value={priority}
											onChange={(e) => setPriority(e.target.value)}
										>
											<option value="baja">🟢 Baja</option>
											<option value="media">🟡 Media</option>
											<option value="alta">🟠 Alta</option>
											<option value="urgente">🔴 Urgente</option>
										</select>
									</div>
								</div>

								{/* Fecha límite */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
										<CalendarIcon className="h-4 w-4" />
										Fecha límite
									</div>
									<div className="p-4">
										<input
											type="date"
											className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
											value={dueDate}
											onChange={(e) => setDueDate(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-8 flex justify-end space-x-3 border-t dark:border-gray-700 pt-4">
							<Button variant="outline" onClick={() => onOpenChange(false)}>
								Cancelar
							</Button>
							<Button onClick={handleSave}>
								Guardar Cambios
							</Button>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
    );
}
