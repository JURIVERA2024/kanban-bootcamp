import React, { createContext, ReactNode, useContext, useState } from "react";

interface KanbanContextType {
    columns: string[];
    tasks: string[];

    createTask: (columnId:string) => Promise<string | undefined>;
    createColumn: ()=> Promise<string | undefined>;
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
    const [columns, setColumns] = useState<string[]>([]);
    const [tasks, setTasks] = useState<string[]>([]);

    const createTask = (columnId:string) => {
        return Promise.resolve(undefined);
    }

    const createColumn = () => {
        return Promise.resolve(undefined);
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



