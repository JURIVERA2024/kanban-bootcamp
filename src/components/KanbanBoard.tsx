import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from 'uuid';
import { BoardColumn, BoardContainer } from "./BoardColumn";
import {
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	useSensor,
	useSensors,
	KeyboardSensor,
	Announcements,
	UniqueIdentifier,
	TouchSensor,
	MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { type Task, TaskCard } from "./TaskCard";
import { hasDraggableData, convertToColumnProps } from "./utils";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { useKanbanContext } from "@/context/kanbanContext";
import { ColumnProps } from "@/types/types";
import { 
	loadBoardData, 
	saveBoardData, 
	addTask, 
	updateTask, 
	moveTask, 
	deleteTask,
	DEFAULT_COLUMN_IDS
} from "@/data/taskStorage";

export type ColumnId = string;

const initialTasks: Task[] = [];

export function KanbanBoard() {
	const {columns, setColumns, createColumn} = useKanbanContext();
	const pickedUpTaskColumn = useRef<ColumnId | null>(null);
	
	// Filtrar solo las columnas visibles
	const visibleColumns = useMemo(() => columns.filter(col => col.isVisible !== false), [columns]);
	
	// Usar los IDs de las columnas visibles para el contexto sortable
	const columnsId = useMemo(() => visibleColumns.map((col) => col.id), [visibleColumns]);
	
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const hasInitializedColumns = useRef(false);

	// Cargar datos guardados al iniciar
	useEffect(() => {
		if (hasInitializedColumns.current) return;
		
		// Cargar datos del almacenamiento
		const savedData = loadBoardData();
		
		// Si tenemos columnas guardadas, utilizarlas directamente
		if (savedData.columns.length > 0) {
			// Convertir las columnas guardadas al formato requerido por el contexto
			const mappedColumns: ColumnProps[] = savedData.columns.map(col => ({
				id: col.id as string,
				title: col.title,
				description: col.title, // Usar título como descripción por defecto
				tasks: [],
				kanban_id: "default-kanban",
				isVisible: true,
				color: col.color // Asegurarse de pasar el color
			}));
			
			// Establecer columnas en el contexto
			setColumns(mappedColumns);
			
			// Extraer todas las tareas y establecerlas
			const allTasks = savedData.columns.flatMap(col => 
				col.tasks.map(task => ({
					...task,
					columnId: col.id 
				}))
			);
			
			setTasks(allTasks);
			hasInitializedColumns.current = true;
		} else {
			// Si no hay datos guardados, inicializar columnas por defecto
			const initializeColumns = async () => {
				await createColumn({
					id: DEFAULT_COLUMN_IDS.PENDING,
					title: "To Do",
					description: "Tareas pendientes",
					tasks: [],
					kanban_id: "default-kanban",
					isVisible: true,
					color: "text-red-400"
				});
				
				await createColumn({
					id: DEFAULT_COLUMN_IDS.IN_PROGRESS,
					title: "In Progress",
					description: "Tareas en progreso",
					tasks: [],
					kanban_id: "default-kanban",
					isVisible: true,
					color: "text-yellow-400"
				});
				
				await createColumn({
					id: DEFAULT_COLUMN_IDS.COMPLETED,
					title: "Done",
					description: "Tareas completadas",
					tasks: [],
					kanban_id: "default-kanban",
					isVisible: true,
					color: "text-green-400"
				});
				
				hasInitializedColumns.current = true;
			};
			
			initializeColumns();
		}
	}, [setColumns, createColumn]);

	// Guardar cambios cuando se actualicen las tareas o columnas
	useEffect(() => {
		if (tasks.length > 0 || columns.length > 0) {
			// Preparar datos para guardar
			const columnsWithTasks = columns.map(col => {
				const columnTasks = tasks.filter(task => task.columnId === col.id);
				return {
					id: col.id,
					title: col.title,
					tasks: columnTasks,
					color: col.color // Añadir color al guardar
				};
			});
			
			saveBoardData({ columns: columnsWithTasks });
		}
	}, [tasks, columns]);

	const [activeColumn, setActiveColumn] = useState<ColumnProps | null>(null);
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: coordinateGetter,
		})
	);

	function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
		const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
		const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
		const column = columns.find((col) => col.id === columnId);
		return {
			tasksInColumn,
			taskPosition,
			column,
		};
	}

	const announcements: Announcements = {
		onDragStart({ active }) {
			if (!hasDraggableData(active)) return;
			if (active.data.current?.type === "Column") {
				const startColumnIdx = columnsId.findIndex((id) => id === active.id);
				const startColumn = columns[startColumnIdx];
				return `Picked up Column ${startColumn?.title} at position: ${startColumnIdx + 1
					} of ${columnsId.length}`;
			} else if (active.data.current?.type === "Task") {
				pickedUpTaskColumn.current = active.data.current.task.columnId as ColumnId;
				const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
					active.id,
					pickedUpTaskColumn.current as ColumnId
				);
				return `Picked up Task ${active.data.current.task.content
					} at position: ${taskPosition + 1} of ${tasksInColumn.length
					} in column ${column?.title}`;
			}
		},
		onDragOver({ active, over }) {
			if (!hasDraggableData(active) || !hasDraggableData(over)) return;

			if (
				active.data.current?.type === "Column" &&
				over.data.current?.type === "Column"
			) {
				const overColumnIdx = columnsId.findIndex((id) => id === over.id);
				return `Column ${active.data.current.column.title} was moved over ${over.data.current.column.title
					} at position ${overColumnIdx + 1} of ${columnsId.length}`;
			} else if (
				active.data.current?.type === "Task" &&
				over.data.current?.type === "Task"
			) {
				const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
					over.id,
					over.data.current.task.columnId as ColumnId
				);
				if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
					return `Task ${active.data.current.task.content
						} was moved over column ${column?.title} in position ${taskPosition + 1
						} of ${tasksInColumn.length}`;
				}
				return `Task was moved over position ${taskPosition + 1} of ${tasksInColumn.length
					} in column ${column?.title}`;
			}
		},
		onDragEnd({ active, over }) {
			if (!hasDraggableData(active) || !hasDraggableData(over)) {
				pickedUpTaskColumn.current = null;
				return;
			}
			if (
				active.data.current?.type === "Column" &&
				over.data.current?.type === "Column"
			) {
				const overColumnPosition = columnsId.findIndex((id) => id === over.id);

				return `Column ${active.data.current.column.title
					} was dropped into position ${overColumnPosition + 1} of ${columnsId.length
					}`;
			} else if (
				active.data.current?.type === "Task" &&
				over.data.current?.type === "Task"
			) {
				const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
					over.id,
					over.data.current.task.columnId as ColumnId
				);
				if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
					return `Task was dropped into column ${column?.title} in position ${taskPosition + 1
						} of ${tasksInColumn.length}`;
				}
				return `Task was dropped into position ${taskPosition + 1} of ${tasksInColumn.length
					} in column ${column?.title}`;
			}
			pickedUpTaskColumn.current = null;
		},
		onDragCancel({ active }) {
			pickedUpTaskColumn.current = null;
			if (!hasDraggableData(active)) return;
			return `Dragging ${active.data.current?.type} cancelled.`;
		},
	};

	const handleTaskUpdate = (updatedTask: Task) => {
		setTasks(prevTasks => {
			const taskExists = prevTasks.some(task => task.id === updatedTask.id);
			if (taskExists) {
				// Update existing task
				const newTasks = prevTasks.map(task =>
					task.id === updatedTask.id ? updatedTask : task
				);
				// Actualizar en almacenamiento
				updateTask(updatedTask);
				return newTasks;
			} else {
				// Add new task
				const newTasks = [...prevTasks, updatedTask];
				// Añadir en almacenamiento
				addTask(updatedTask.columnId, updatedTask);
				return newTasks;
			}
		});
	};

	return (
		<DndContext
			accessibility={{
				announcements,
			}}
			sensors={sensors}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onDragOver={onDragOver}
		>
			<BoardContainer>
				<SortableContext items={columnsId}>
					{visibleColumns.map((col) => (
						<BoardColumn
							key={col.id}
							column={col}
							tasks={tasks.filter((task) => task.columnId === col.id)}
							onTaskUpdate={handleTaskUpdate}
						/>
					))}
				</SortableContext>
			</BoardContainer>

			{"document" in window &&
				createPortal(
					<DragOverlay>
						{activeColumn && (
							<BoardColumn
								isOverlay
								column={activeColumn}
								tasks={tasks.filter(
									(task) => task.columnId === activeColumn.id
								)}
								onTaskUpdate={handleTaskUpdate}
							/>
						)}
						{activeTask && <TaskCard task={activeTask} isOverlay />}
					</DragOverlay>,
					document.body
				)}
		</DndContext>
	);

	function onDragStart(event: DragStartEvent) {
		if (!hasDraggableData(event.active)) return;
		const data = event.active.data.current;
		if (data?.type === "Column") {
			setActiveColumn(convertToColumnProps(data.column));
			return;
		}

		if (data?.type === "Task") {
			setActiveTask(data.task);
			return;
		}
	}

	function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null);
		setActiveTask(null);

		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (!hasDraggableData(active)) return;

		// Manejar cambio de columnas
		if (
			active.data.current?.type === "Column" &&
			over.data.current?.type === "Column" &&
			activeId !== overId
		) {
			const activeColumnIndex = columnsId.findIndex((id) => id === activeId);
			const overColumnIndex = columnsId.findIndex((id) => id === overId);
			// Actualizar el orden de las columnas
			const updatedColumns = arrayMove(
				columns,
				activeColumnIndex,
				overColumnIndex
			);
			setColumns(updatedColumns);

			// Guardar el nuevo orden de columnas
			const columnsWithTasks = updatedColumns.map(col => {
				const columnTasks = tasks.filter(task => task.columnId === col.id);
				return {
					id: col.id,
					title: col.title,
					tasks: columnTasks
				};
			});
			
			saveBoardData({ columns: columnsWithTasks });
		}

		// Manejar cambio de tareas
		if (
			active.data.current?.type === "Task" &&
			over.data.current?.type === "Task"
		) {
			const activeTaskId = activeId;
			const activeColumnId = active.data.current.task.columnId;
			const overTaskId = overId;
			const overColumnId = over.data.current.task.columnId;
			
			// Si la tarea se movió a otra columna
			if (activeColumnId !== overColumnId) {
				// Obtenemos todas las tareas de la columna de origen
				const startTasksInColumn = tasks.filter(
					(task) => task.columnId === activeColumnId
				);
				// Eliminamos la tarea de la columna de origen
				const newStartTasksInColumn = startTasksInColumn.filter(
					(task) => task.id !== activeTaskId
				);
				
				// Obtenemos todas las tareas de la columna de destino
				const finishTasksInColumn = tasks.filter(
					(task) => task.columnId === overColumnId
				);
				
				// Encontramos la posición de la tarea sobre la que se soltó
				const overTaskIndex = finishTasksInColumn.findIndex(
					(task) => task.id === overTaskId
				);

				// Creamos la nueva tarea con el nuevo columnId
				const updatedTask = {
					...tasks.find((task) => task.id === activeTaskId)!,
					columnId: overColumnId,
				};
				
				// Insertamos la tarea en la columna de destino
				finishTasksInColumn.splice(overTaskIndex, 0, updatedTask);
				
				// Actualizamos el estado de tareas
				const newTasks = tasks.filter(
					(task) =>
						task.columnId !== activeColumnId && task.columnId !== overColumnId
				);
				
				setTasks([
					...newTasks,
					...newStartTasksInColumn,
					...finishTasksInColumn,
				]);
				
				// Actualizar en el almacenamiento
				moveTask(activeTaskId, activeColumnId, overColumnId);
			} else {
				// Si la tarea se movió dentro de la misma columna
				const tasksInColumn = tasks.filter(
					(task) => task.columnId === activeColumnId
				);
				
				const activeIndex = tasksInColumn.findIndex(
					(task) => task.id === activeId
				);
				const overIndex = tasksInColumn.findIndex(
					(task) => task.id === overId
				);
				
				if (activeIndex !== overIndex) {
					const newOrder = arrayMove(tasksInColumn, activeIndex, overIndex);
					
					const newTasks = tasks.filter(
						(task) => task.columnId !== activeColumnId
					);
					
					setTasks([...newTasks, ...newOrder]);
					
					// Guardar el nuevo orden
					const columnsWithTasks = columns.map(col => {
						const columnTasks = col.id === activeColumnId 
							? newOrder 
							: tasks.filter(task => task.columnId === col.id);
						
						return {
							id: col.id,
							title: col.title,
							tasks: columnTasks
						};
					});
					
					saveBoardData({ columns: columnsWithTasks });
				}
			}
		}
	}

	function onDragOver(event: DragOverEvent) {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (!hasDraggableData(active) || !hasDraggableData(over)) return;

		// Manejar cambio de tareas entre columnas
		if (
			active.data.current?.type === "Task" &&
			over.data.current?.type === "Column"
		) {
			const activeColumnId = active.data.current.task.columnId;
			const overColumnId = over.id;
			
			// Si la columna de origen es diferente a la de destino
			if (activeColumnId !== overColumnId) {
				// Encontramos la tarea que se está moviendo
				const activeTask = tasks.find((task) => task.id === activeId);
				if (!activeTask) return;
				
				// Creamos la nueva tarea con el nuevo columnId
				const updatedTask = {
					...activeTask,
					columnId: overColumnId as string,
				};
				
				// Actualizamos el estado de tareas
				setTasks(tasks.map(task => 
					task.id === activeId ? updatedTask : task
				));
				
				// Actualizar en el almacenamiento
				moveTask(activeId, activeColumnId, overColumnId);
			}
		}
	}
}
