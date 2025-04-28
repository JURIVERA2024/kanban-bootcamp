import { Task } from "@/components/TaskCard";
import { UniqueIdentifier } from "@dnd-kit/core";

// IDs fijos para las columnas predeterminadas
export const DEFAULT_COLUMN_IDS = {
  PENDING: 'column-pendiente',
  IN_PROGRESS: 'column-en-progreso',
  COMPLETED: 'column-completado'
};

// Namespace para guardar las columnas y sus tareas
export interface Column {
  id: UniqueIdentifier;
  title: string;
  tasks: Task[];
  color?: string;
}

export interface BoardData {
  columns: Column[];
}

const LOCAL_STORAGE_KEY = 'kanban-tasks-data';
const COLUMNS_KEY = 'kanban-columns';

// Columnas por defecto
const defaultColumns: Column[] = [
  {
    id: DEFAULT_COLUMN_IDS.PENDING,
    title: 'To Do',
    tasks: [],
    color: 'text-red-400'
  },
  {
    id: DEFAULT_COLUMN_IDS.IN_PROGRESS,
    title: 'In Progress',
    tasks: [],
    color: 'text-yellow-400'
  },
  {
    id: DEFAULT_COLUMN_IDS.COMPLETED,
    title: 'Done',
    tasks: [],
    color: 'text-green-400'
  }
];

// Función para cargar solo las columnas
export const loadColumns = (): Column[] => {
  try {
    const storedColumns = localStorage.getItem(COLUMNS_KEY);
    if (storedColumns) {
      return JSON.parse(storedColumns);
    }
  } catch (error) {
    console.error('Error al cargar columnas:', error);
  }
  
  // Si no hay columnas guardadas, usar las predeterminadas
  return [...defaultColumns];
};

// Función para guardar solo las columnas
export const saveColumns = (columns: Column[]): void => {
  try {
    localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns));
  } catch (error) {
    console.error('Error al guardar columnas:', error);
  }
};

// Función para cargar los datos del localStorage
export const loadBoardData = (): BoardData => {
  // Primero cargamos las columnas (estructura)
  const columns = loadColumns();
  
  try {
    // Luego intentamos cargar las tareas
    const tasksData = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (tasksData) {
      const parsedData = JSON.parse(tasksData);
      
      // Si hay datos guardados, asociamos las tareas con sus columnas correspondientes
      if (parsedData && Array.isArray(parsedData)) {
        // El formato antiguo era un array de tareas
        for (const task of parsedData) {
          if (task.columnId) {
            const columnIndex = columns.findIndex(col => col.id === task.columnId);
            if (columnIndex !== -1) {
              columns[columnIndex].tasks.push(task);
            } else {
              // Si la columna no existe (posiblemente se eliminó), 
              // asignamos la tarea a la columna "Pendiente"
              const pendingColumn = columns.find(col => col.id === DEFAULT_COLUMN_IDS.PENDING);
              if (pendingColumn) {
                task.columnId = DEFAULT_COLUMN_IDS.PENDING;
                pendingColumn.tasks.push(task);
              }
            }
          }
        }
      } else if (parsedData && parsedData.columns) {
        // Nuevo formato: objeto con array de columnas
        // Recorremos las columnas guardadas para recuperar sus tareas
        for (const savedColumn of parsedData.columns) {
          const columnIndex = columns.findIndex(col => col.id === savedColumn.id);
          
          if (columnIndex !== -1) {
            // Usamos las tareas de la columna guardada
            if (savedColumn.tasks) {
              columns[columnIndex].tasks = savedColumn.tasks;
            }
            
            // Preservamos el color si existe
            if (savedColumn.color) {
              columns[columnIndex].color = savedColumn.color;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error al cargar tareas:', error);
  }
  
  return { columns };
};

// Función para guardar los datos en localStorage
export const saveBoardData = (data: BoardData): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    
    // También actualizamos las columnas por si ha habido cambios
    saveColumns(data.columns);
  } catch (error) {
    console.error('Error al guardar datos:', error);
  }
};

// Función para añadir una columna nueva
export const addColumn = (title: string, color?: string): BoardData => {
  const data = loadBoardData();
  const newColumn: Column = {
    id: `column-${Date.now()}`,
    title,
    tasks: [],
    color
  };
  
  data.columns.push(newColumn);
  saveBoardData(data);
  return data;
};

// Función para añadir una tarea
export const addTask = (columnId: UniqueIdentifier, task: Task): BoardData => {
  const data = loadBoardData();
  const columnIndex = data.columns.findIndex(col => col.id === columnId);
  
  if (columnIndex !== -1) {
    data.columns[columnIndex].tasks.push({
      ...task,
      id: crypto.randomUUID(),
      columnId,
      createdAt: new Date().toISOString()
    });
    saveBoardData(data);
  }
  
  return data;
};

// Función para actualizar una tarea
export const updateTask = (task: Task): BoardData => {
  const data = loadBoardData();
  const columnIndex = data.columns.findIndex(col => col.id === task.columnId);
  
  if (columnIndex !== -1) {
    const taskIndex = data.columns[columnIndex].tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      data.columns[columnIndex].tasks[taskIndex] = {
        ...task,
        updatedAt: new Date().toISOString()
      };
      saveBoardData(data);
    }
  }
  
  return data;
};

// Función para mover una tarea entre columnas
export const moveTask = (taskId: UniqueIdentifier, fromColumnId: UniqueIdentifier, toColumnId: UniqueIdentifier): BoardData => {
  const data = loadBoardData();
  const fromColumnIndex = data.columns.findIndex(col => col.id === fromColumnId);
  const toColumnIndex = data.columns.findIndex(col => col.id === toColumnId);
  
  if (fromColumnIndex !== -1 && toColumnIndex !== -1) {
    const taskIndex = data.columns[fromColumnIndex].tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      const task = data.columns[fromColumnIndex].tasks[taskIndex];
      
      // Eliminar de la columna original
      data.columns[fromColumnIndex].tasks.splice(taskIndex, 1);
      
      // Añadir a la nueva columna
      data.columns[toColumnIndex].tasks.push({
        ...task,
        columnId: toColumnId,
        updatedAt: new Date().toISOString()
      });
      
      saveBoardData(data);
    }
  }
  
  return data;
};

// Función para eliminar una tarea
export const deleteTask = (taskId: UniqueIdentifier): BoardData => {
  const data = loadBoardData();
  
  for (let i = 0; i < data.columns.length; i++) {
    const taskIndex = data.columns[i].tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      data.columns[i].tasks.splice(taskIndex, 1);
      saveBoardData(data);
      break;
    }
  }
  
  return data;
};

// Función para resetear el tablero (borrar datos y regresar a columnas por defecto)
export const resetBoard = (): BoardData => {
  // Limpia el almacenamiento
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(COLUMNS_KEY);
  
  // Crea un nuevo tablero con las columnas predeterminadas
  const defaultBoardData: BoardData = {
    columns: [...defaultColumns]
  };
  
  // Guarda el tablero predeterminado
  saveBoardData(defaultBoardData);
  
  return defaultBoardData;
};