import React, { createContext, ReactNode, useContext, useState } from "react";
import { ColumnProps, TaskProps } from "../types/types";
import { v4 as uuidv4 } from 'uuid';
interface KanbanContextType {
    columns: ColumnProps[];
    tasks: TaskProps[];

    createTask: (columnId:string, task:TaskProps) => void;
    createColumn: (column:ColumnProps) => void;
    deleteTask: (taskId:string) => void;
    deleteColumn: (columnId:string)=> void;

    handleChangeTaskColumn:(taskId:string, newColumnId: string) => void;
    handleChangeTaskPosition: (taskId:string, newPosition:string) => void;
    handleChangeColumnPosition: (columnId:string, newPosition:string) => void;

    handleChangeColumnColor:(columnId:string, color:string) => void;
}

interface KanbanProviderProps{
    children: ReactNode;
}

export const KanbanContext = createContext<KanbanContextType>({} as KanbanContextType);

const KanbanContextProvider: React.FC<KanbanProviderProps> = ({children}) => {
    const [columns, setColumns] = useState<ColumnProps[]>([]);
    const [tasks, setTasks] = useState<TaskProps[]>([]);

    const createTask = (columnId:string, task:TaskProps) => {
        const newTask = {
            id: uuidv4(),
            title: task.title,
            description: task.description? task.description : '',
            assignee: task.assignee? task.assignee : '',
            bg_color: task.bg_color,
            status: task.status? task.status : '',
            column_id: columnId
        }
        setTasks([...tasks, newTask]);
    }

    const createColumn = async(column:ColumnProps) => {
        let color = column.color? column.color : 'text-black';
        column.title && column.color ? column.title === 'To do' ?  color = 'text-red-400' :
        column.title === 'In Progress' ? color = 'text-yellow-400' :
        column.title === 'Done' ? color = 'text-green-400' :
        color = 'text-black' : color = 'text-black';
        
        const newColumn = {
            id: uuidv4(),
            title: column.title,
            description: column.description? column.description : '',
            color: color,
            tasks: column.tasks? column.tasks : [],
            kanban_id: column.kanban_id
        }
        setColumns([...columns, newColumn]);
    }

    const deleteTask = (taskId:string) => {

    }

    const deleteColumn = (columnId:string) => {

    }

    const handleChangeTaskColumn = (taskId:string, newColumnId: string) => {

    }

    const handleChangeTaskPosition = (taskId:string, newPosition:string) => {

    }

    const handleChangeColumnPosition = (columnId:string, newPosition:string) => {

    }

    const handleChangeColumnColor = (columnId:string, color:string) => {

    }

    const contextValue: KanbanContextType = {
        columns,
        tasks,
        createTask,
        createColumn,
        deleteTask,
        deleteColumn,
        handleChangeTaskColumn,
        handleChangeTaskPosition,
        handleChangeColumnPosition,
        handleChangeColumnColor
    }

    return <KanbanContext.Provider value={contextValue}>{children}</KanbanContext.Provider>;
}

export default KanbanContextProvider;

export const useKanbanContext = () => {
    const context = useContext(KanbanContext);
    if(!context) throw new Error('useKanbanContext must be used within an AdvancedFilterProvider')
    return context;
}
