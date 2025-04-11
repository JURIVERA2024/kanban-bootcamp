import { useState } from "react";

interface ColumnCreationFormProps {
    className?: string;
}

const ColumnCreationForm = ({ className }: ColumnCreationFormProps) => {
    const [columnTitle, setColumnTitle] = useState('');
    const [columnColor, setColumnColor] = useState('bg-black');
    const [columnDescription, setColumnDescription] = useState('');


    const handleColumnCreation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearForm();
    }
    const handleSelectColumnColor = (color: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setColumnColor(color);
    }

    const clearForm = () => {
        setColumnTitle('');
        setColumnColor('');
        setColumnDescription('');
    }
    console.log(columnColor)

    return (
        <form id="columnCreationDetailedForm" className={`flex flex-col gap-2 container mx-auto bg-white p-4 rounded-md border-gray-300 border-2 max-w-[350px] ${className || ''}`}>
            <h1 className="text-1xl font-bold text-center">New Column</h1>
            <hr className="w-full border-gray-300 border-1" />
            <label htmlFor="columnTitle" className="text-start font-bold">Column title*</label>
            <input name="columnTitle"
                id="columnTitle"
                type="text"
                placeholder="Column title"
                value={columnTitle}
                className="border-2 border-gray-300 rounded-md p-2 text-center mb-5"
                onChange={(e) => setColumnTitle(e.target.value)} />
            <label htmlFor="columnColor" className="text-start font-bold">Column color*</label>
            <ul id="columnColorList" className="flex flex-row gap-2 mb-5 justify-center">
                <li>
                    <button className={`border-2 ${columnColor === 'bg-black' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-black`} onClick={(e) => handleSelectColumnColor('bg-black', e)}></button>
                </li>
                <li>
                    <button className={`border-2 ${columnColor === 'bg-red-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-red-500`} onClick={(e) => handleSelectColumnColor('bg-red-500', e)}></button>
                </li>
                <li>
                    <button className={`border-2 ${columnColor === 'bg-blue-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-blue-500`} onClick={(e) => handleSelectColumnColor('bg-blue-500', e)}></button>
                </li>
                <li>
                    <button className={`border-2 ${columnColor === 'bg-green-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-green-500`} onClick={(e) => handleSelectColumnColor('bg-green-500', e)}></button>
                </li>
                <li>
                    <button className={`border-2 ${columnColor === 'bg-yellow-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-yellow-500`} onClick={(e) => handleSelectColumnColor('bg-yellow-500', e)}></button>
                </li>
                <li>
                    <button className={`border-2 ${columnColor === 'bg-violet-500' ? 'border-gray-700' : 'border-gray-300'} rounded-md p-2 text-center bg-violet-500`} onClick={(e) => handleSelectColumnColor('bg-violet-500', e)}></button>
                </li>
            </ul>
            <label htmlFor="columnDescription" className="text-start font-bold">Column description*</label>
            <textarea name="columnDescription"
                id="columnDescription"
                placeholder="Column Description"
                value={columnDescription}
                className="border-2 border-gray-300 rounded-md p-2 text-center mb-2"
                rows={3}
                cols={30}
                onChange={(e) => setColumnDescription(e.target.value)}>

            </textarea>
            <hr className="w-full border-gray-300 border-1" />
            <div className="flex flex-row gap-2 justify-end items-center py-1">
                <button className="bg-red-300 rounded-md p-2 text-center hover:bg-red-400" onClick={() =>{}}>Cancel</button>
                <button className="bg-green-300 rounded-md p-2 text-center hover:bg-green-400" onClick={() => handleColumnCreation}>Create</button>
            </div>

        </form>
    );
}


export default ColumnCreationForm;