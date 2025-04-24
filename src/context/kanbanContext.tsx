import React, { createContext, ReactNode, useContext, useState } from "react";
import { ColumnProps, TaskProps } from "../types/types";
import { v4 as uuidv4 } from 'uuid';
interface KanbanContextType {
    columns: ColumnProps[];
    tasks: TaskProps[];
    setColumns: (columns: ColumnProps[] | ((prevColumns: ColumnProps[]) => ColumnProps[])) => void;

    createTask: (columnId: string, task: TaskProps) => void;
    createColumn: (column: ColumnProps) => void;
    deleteTask: (taskId: string) => void;
    deleteColumn: (columnId: string) => void;

    handleChangeTaskColumn: (taskId: string, newColumnId: string) => void;
    handleChangeTaskPosition: (taskId: string, newPosition: string) => void;
    handleChangeColumnPosition: (columnId: string, newPosition: string) => void;

    handleChangeColumnColor: (columnId: string, color: string) => void;
    updateColumn: (columnId: string, updates: Partial<ColumnProps>) => void;
}

interface KanbanProviderProps {
    children: ReactNode;
}

export const KanbanContext = createContext<KanbanContextType>({} as KanbanContextType);

const KanbanContextProvider: React.FC<KanbanProviderProps> = ({ children }) => {
    const [columns, setColumns] = useState<ColumnProps[]>([]);
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    console.log("columns", columns);
    const createTask = (columnId: string, task: TaskProps) => {
        const newTask = {
            id: uuidv4(),
            title: task.title,
            description: task.description ? task.description : '',
            assignee: task.assignee ? task.assignee : '',
            bg_color: task.bg_color,
            status: task.status ? task.status : '',
            column_id: columnId
        }
        setTasks([...tasks, newTask]);
    }

    const createColumn = async (column: ColumnProps) => {
        console.log("column", column);
        let color = column.color ? column.color : 'text-black';
        console.log("color", color);
        if (column.title) {
            if (column.title === 'To do') {
                color = 'text-red-400';
            } else if (column.title === 'In progress') {
                color = 'text-yellow-400';
            } else if (column.title === 'Done') {
                color = 'text-green-400';
            }
        }

        const newColumn = {
            id: uuidv4(),
            title: column.title,
            description: column.description ? column.description : '',
            color: color,
            tasks: column.tasks ? column.tasks : [],
            kanban_id: column.kanban_id,
            isVisible: column.isVisible !== undefined ? column.isVisible : true
        }

        setColumns(prevColumns => [...prevColumns, newColumn]);

        return newColumn;
    }

    const deleteTask = (taskId: string) => {

    }

    const deleteColumn = (columnId: string) => {
        setColumns(prevColumns => prevColumns.filter(column => column.id !== columnId));
    }

    const handleChangeTaskColumn = (taskId: string, newColumnId: string) => {

    }

    const handleChangeTaskPosition = (taskId: string, newPosition: string) => {

    }

    const handleChangeColumnPosition = (columnId: string, newPosition: string) => {
        setColumns(prevColumns => {
            const columnIndex = prevColumns.findIndex(column => column.id === columnId);
            const newPositionIndex = parseInt(newPosition);

            if (columnIndex === -1 || isNaN(newPositionIndex) ||
                newPositionIndex < 0 || newPositionIndex >= prevColumns.length) {
                return prevColumns;
            }

            const newColumns = [...prevColumns];
            const [movedColumn] = newColumns.splice(columnIndex, 1);
            newColumns.splice(newPositionIndex, 0, movedColumn);

            return newColumns;
        });
    }

    const handleChangeColumnColor = (columnId: string, color: string) => {
        setColumns(prevColumns => 
            prevColumns.map(column => 
                column.id === columnId 
                    ? { ...column, color } 
                    : column
            )
        );
    }

    const updateColumn = (columnId: string, updates: Partial<ColumnProps>) => {
        setColumns(prevColumns => 
            prevColumns.map(column => 
                column.id === columnId 
                    ? { ...column, ...updates } 
                    : column
            )
        );
    }

    const editColumn = (columnId: string, title: string, description: string) => {
        setColumns(prevColumns => 
            prevColumns.map(column => 
                column.id === columnId 
                    ? { ...column, title, description } 
                    : column
            )
        );
    }

    const contextValue: KanbanContextType = {
        columns,
        setColumns,
        tasks,
        createTask,
        createColumn,
        deleteTask,
        deleteColumn,
        handleChangeTaskColumn,
        handleChangeTaskPosition,
        handleChangeColumnPosition,
        handleChangeColumnColor,
        updateColumn
    }

    return <KanbanContext.Provider value={contextValue}>{children}</KanbanContext.Provider>;
}

export default KanbanContextProvider;

export const useKanbanContext = () => {
    const context = useContext(KanbanContext);
    if (!context) throw new Error('useKanbanContext must be used within an AdvancedFilterProvider')
    return context;
}
