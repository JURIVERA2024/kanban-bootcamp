import { useState } from "react";


const ColumnCreationForm = () => {
    const [columnTitle, setColumnTitle] = useState('');
    const [columnColor, setColumnColor] = useState('');
    const [columnDescription, setColumnDescription] = useState('');

    const handleColumnCreation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearForm();
    }

    const clearForm = () => {
        setColumnTitle('');
        setColumnColor('');
        setColumnDescription('');
    }

    return (
        <form className="flex flex-col gap-2 container mx-auto items-center justify-center bg-white p-4 rounded-md border-gray-300 border-2 max-w-[350px]">
            <h1 className="text-1xl font-bold text center">New Column</h1>
            <label htmlFor="columnTitle">Column title</label>
            <input name="columnTitle"
                id="columnTitle"
                type="text"
                placeholder="Column title"
                value={columnTitle}
                className="border-2 border-gray-300 rounded-md p-2 text-center"
                onChange={(e) => setColumnTitle(e.target.value)} />
            <label htmlFor="columnDescription">Column description</label>
            <input
                name="columnDescription"
                id="columnDescription"
                type="text"
                placeholder="Column Description"
                value={columnDescription}
                className="border-2 border-gray-300 rounded-md p-2 text-center"
                onChange={(e) => setColumnDescription(e.target.value)} />
            <label htmlFor="columnColor">Column color</label>
            <input
                name="columnColor"
                id="columnColor"
                type="color"
                value={columnColor}
            />
        </form>
    )
}


export default ColumnCreationForm;