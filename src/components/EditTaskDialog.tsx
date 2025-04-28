import { useState, useEffect } from "react";
import { Task } from "./TaskCard";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { AlertCircle, CalendarIcon, Tags, Users, User, MessageSquare, GitBranch, Package, Plus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ReactMarkdown from "react-markdown";

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

// Componentes personalizados para ReactMarkdown
const markdownComponents = {
	h1: ({node, ...props}: any) => <h1 className="text-3xl font-bold py-1 my-2 border-b pb-2" {...props} />,
	h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold py-1 my-2" {...props} />,
	h3: ({node, ...props}: any) => <h3 className="text-xl font-semibold py-1 my-1" {...props} />,
	input: ({node, ...props}: any) => props.type === 'checkbox' ? (
		<input type="checkbox" readOnly checked={props.checked} className="mr-1 h-4 w-4" />
	) : (
		<input {...props} />
	)
};

export function EditTaskDialog({ task, onSave, open, onOpenChange }: EditTaskDialogProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("media");
	const [dueDate, setDueDate] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");
	const [type, setType] = useState<"bug" | "feature" | "improvement" | "documentation" | "question">("feature");
	const [project, setProject] = useState("");
	const [assignees, setAssignees] = useState<any[]>([]);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState<any[]>([]);
	const [editMode, setEditMode] = useState(false);
	
	// Establecer creador si no existe
	const creator = task?.creator || sampleUsers[0];

	// Inicializar datos cuando se abre el diálogo
	useEffect(() => {
		if (open && task) {
			setTitle(task.title || "");
			setDescription(task.description || "");
			setPriority(task.priority || "media");
			setDueDate(task.dueDate || "");
			setTags(task.tags || []);
			setType((task.type || "feature") as "bug" | "feature" | "improvement" | "documentation" | "question");
			setProject(task.project || "");
			setAssignees(task.assignees || []);
			setComments(task.comments || []);
			// Iniciar en modo vista, no edición
			setEditMode(false);
		}
	}, [open, task]);

	const handleSave = () => {
		onSave({
			...task,
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
			comments
		});
		onOpenChange(false);
		setEditMode(false);
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
		if (!comment.trim()) return;
		
		const newComment = {
			id: Math.random().toString(),
			author: sampleUsers[0],
			content: comment,
			createdAt: new Date().toISOString()
		};
		
		setComments([...comments, newComment]);
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
								{task?.id && <span className="text-gray-500">#{String(task.id).substring(0, 6)}</span>}
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
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
										<span>Descripción</span>
										<Button 
											variant="ghost" 
											size="sm" 
											onClick={() => setEditMode(!editMode)}
											className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
										>
											{editMode ? "Vista previa" : "Editar"}
										</Button>
									</div>
									<div className="p-4">
										{editMode ? (
											<textarea
												className="w-full min-h-[200px] p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white resize-y font-mono text-sm"
												value={description}
												onChange={(e) => setDescription(e.target.value)}
												placeholder="Añade una descripción detallada usando markdown..."
											/>
										) : (
											<div className="prose dark:prose-invert max-w-none break-words p-2">
												{description ? (
													<ReactMarkdown components={markdownComponents}>
														{description}
													</ReactMarkdown>
												) : (
													<div className="text-gray-500 dark:text-gray-400 italic text-center py-10">
														No hay descripción. Haz clic en "Editar" para añadir una.
													</div>
												)}
											</div>
										)}
									</div>
								</div>

								{/* Comentarios */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700">
										Comentarios ({comments.length})
									</div>
									{comments.length > 0 && (
										<div className="p-4 space-y-4">
											{comments.map(comment => (
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
													<div className="pl-8 prose dark:prose-invert max-w-none text-sm">
														<ReactMarkdown components={markdownComponents}>
															{comment.content}
														</ReactMarkdown>
													</div>
												</div>
											))}
										</div>
									)}

									{/* Añadir comentario */}
									<div className="p-4 border-t border-gray-200 dark:border-gray-700">
										<div className="flex items-start gap-2">
											<Avatar className="h-8 w-8 mt-1">
												<AvatarImage src={sampleUsers[0].avatar} alt={sampleUsers[0].name} />
												<AvatarFallback>{sampleUsers[0].name.substring(0, 2)}</AvatarFallback>
											</Avatar>
											<div className="flex-1 border rounded-md border-gray-300 dark:border-gray-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
												<textarea
													className="w-full p-3 rounded-md dark:bg-gray-700 dark:text-white min-h-[100px] text-sm font-mono focus:outline-none"
													value={comment}
													onChange={(e) => setComment(e.target.value)}
													placeholder="Añade un comentario... (usa markdown para el formato)"
												/>
												<div className="border-t border-gray-300 dark:border-gray-600 p-2 flex justify-end">
													<Button onClick={addComment}>
														Comentar
													</Button>
												</div>
											</div>
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
														<span className="text-sm">{user.name}</span>
													</div>
													<button
														className={`w-4 h-4 rounded-sm flex items-center justify-center ${
															assignees.some(a => a.id === user.id)
																? "bg-blue-500 text-white"
																: "border border-gray-300 dark:border-gray-600"
														}`}
														onClick={() => toggleAssignee(user)}
													>
														{assignees.some(a => a.id === user.id) && (
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="10"
																height="10"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="3"
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<polyline points="20 6 9 17 4 12" />
															</svg>
														)}
													</button>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Fecha de entrega */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
										<CalendarIcon className="h-4 w-4" />
										Fecha de entrega
									</div>
									<div className="p-4">
										<input
											type="date"
											className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
											value={dueDate}
											onChange={(e) => setDueDate(e.target.value)}
										/>
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
											className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
											value={priority}
											onChange={(e) => setPriority(e.target.value)}
										>
											<option value="baja">Baja</option>
											<option value="media">Media</option>
											<option value="alta">Alta</option>
											<option value="urgente">Urgente</option>
										</select>
									</div>
								</div>

								{/* Tipo */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
										<Package className="h-4 w-4" />
										Tipo
									</div>
									<div className="p-4">
										<select
											className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
											value={type}
											onChange={(e) => setType(e.target.value as "bug" | "feature" | "improvement" | "documentation" | "question")}
										>
											<option value="bug">🐛 Bug</option>
											<option value="feature">✨ Funcionalidad</option>
											<option value="improvement">⚡ Mejora</option>
											<option value="documentation">📚 Documentación</option>
											<option value="question">❓ Pregunta</option>
										</select>
									</div>
								</div>

								{/* Proyecto */}
								<div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 font-medium border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
										<GitBranch className="h-4 w-4" />
										Proyecto
									</div>
									<div className="p-4">
										<select
											className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
											value={project}
											onChange={(e) => setProject(e.target.value)}
										>
											<option value="">Seleccionar proyecto</option>
											{sampleProjects.map(project => (
												<option key={project} value={project}>{project}</option>
											))}
										</select>
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

								{/* Botones */}
								<div className="flex justify-end space-x-2 mt-6">
									<Button variant="outline" onClick={() => onOpenChange(false)}>
										Cancelar
									</Button>
									<Button onClick={handleSave}>
										Guardar
									</Button>
								</div>
							</div>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
