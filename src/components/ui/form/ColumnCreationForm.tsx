import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useKanbanContext } from "@/context/kanbanContext";
import { v4 as uuidv4 } from 'uuid';
interface ColumnCreationFormProps {
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const ColumnCreationForm = ({ className, open = false, onOpenChange }: ColumnCreationFormProps) => {
    const [columnTitle, setColumnTitle] = useState('');
    const [columnColor, setColumnColor] = useState('bg-black');
    const [columnDescription, setColumnDescription] = useState('');
    const { createColumn } = useKanbanContext();
    const [tryCreate, setTryCreate] = useState(false);


    const handleColumnCreation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createColumn({
            id: uuidv4(),
            title: columnTitle,
            description: columnDescription,
            color: columnColor,
            tasks: [],
            kanban_id: "default-kanban",
            isVisible: true
        });
        clearForm();
        onOpenChange?.(false);
    }

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        clearForm();
        onOpenChange?.(false);
    }

    const handleSelectColumnColor = (color: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const isDarkMode = document.documentElement.classList.contains('dark');
        if (color === 'text-black' && isDarkMode) {
            setColumnColor('text-white');
        } else {
            setColumnColor(color);
        }
    }

    const clearForm = () => {
        setColumnTitle('');
        setColumnColor('');
        setColumnDescription('');
        setTryCreate(false);
    }

    const isFormValid = () => {
        return columnTitle.trim() !== '';
    }
    console.log(columnColor)

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-0 py-0 rounded-md shadow-lg w-[350px] max-w-md">

                    <form id="columnCreationDetailedForm" onSubmit={handleColumnCreation} className={`flex flex-col gap-2 container mx-auto bg-white dark:bg-gray-900 p-4 rounded-md border-gray-300 border-2 max-w-[350px] ${className || ''}`}>
                        <h1 className="text-1xl font-bold text-center">New Column</h1>
                        <hr className="w-full border-gray-300 border-1" />
                        <label htmlFor="columnTitle" className="text-start font-bold">Column title*</label>
                        <input name="columnTitle"
                            id="columnTitle"
                            type="text"
                            placeholder="Column title"
                            value={columnTitle}
                            className="border-2 border-gray-300 rounded-md p-2 mb-2 text-start dark:bg-gray-800"
                            onChange={(e) => {
                                setColumnTitle(e.target.value);
                                if (e.target.value.trim() !== '') {
                                    setTryCreate(false);
                                }
                            }} />
                        <span hidden={!tryCreate || columnTitle.trim() !== ''} className="text-red-500 text-sm p-0 mb-2">Column title is required</span>
                        <label htmlFor="columnColor" className="text-start font-bold">Column color*</label>
                        <ul id="columnColorList" className="flex flex-row gap-2 mb-5 justify-center">
                            <li>
                                <button className={`border-2 ${columnColor === 'text-black' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-black dark:bg-white`} onClick={(e) => handleSelectColumnColor('text-black', e)}></button>
                            </li>
                            <li>
                                <button className={`border-2 ${columnColor === 'text-red-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-red-500`} onClick={(e) => handleSelectColumnColor('text-red-500', e)}></button>
                            </li>
                            <li>
                                <button className={`border-2 ${columnColor === 'text-blue-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-blue-500`} onClick={(e) => handleSelectColumnColor('text-blue-500', e)}></button>
                            </li>
                            <li>
                                <button className={`border-2 ${columnColor === 'text-green-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-green-500`} onClick={(e) => handleSelectColumnColor('text-green-500', e)}></button>
                            </li>
                            <li>
                                <button className={`border-2 ${columnColor === 'text-yellow-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-yellow-500`} onClick={(e) => handleSelectColumnColor('text-yellow-500', e)}></button>
                            </li>
                            <li>
                                <button className={`border-2 ${columnColor === 'text-violet-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-violet-500`} onClick={(e) => handleSelectColumnColor('text-violet-500', e)}></button>
                            </li>
                        </ul>
                        <label htmlFor="columnDescription" className="text-start font-bold">Column description*</label>
                        <textarea name="columnDescription"
                            id="columnDescription"
                            placeholder="Column Description"
                            value={columnDescription}
                            className="border-2 border-gray-300 rounded-md p-2 mb-2 text-start dark:bg-gray-800"
                            rows={3}
                            cols={30}
                            onChange={(e) => setColumnDescription(e.target.value)}>

                        </textarea>
                        <hr className="w-full border-gray-300 border-1" />
                        <div className="flex flex-row gap-2 justify-end items-center py-1">
                            <button className="bg-red-300 dark:bg-red-900 rounded-md p-2 text-center hover:bg-red-400 dark:hover:bg-red-800" onClick={(e) => { handleCancel(e) }}>Cancel</button>
                            <div 
                                onMouseEnter={() => {
                                    if (!isFormValid()) {
                                        setTryCreate(true);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (columnTitle.trim() !== '') {
                                        setTryCreate(false);
                                    }
                                }}
                            >
                                <button
                                    type="submit"
                                    className={`rounded-md p-2 text-center ${isFormValid()
                                        ? 'bg-green-300 dark:bg-green-900 hover:bg-green-400 dark:hover:bg-green-800'
                                        : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50'
                                        }`}
                                    disabled={!isFormValid()}
                                >Create</button>
                            </div>
                        </div>

                    </form>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}


export default ColumnCreationForm;
