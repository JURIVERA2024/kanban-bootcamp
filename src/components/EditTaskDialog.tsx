import { useState } from "react";
import { Task } from "./TaskCard";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

interface EditTaskDialogProps {
    task: Task;
	onSave: (updatedTask: Task) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ task, onSave, open, onOpenChange }: EditTaskDialogProps) {
	const [content, setContent] = useState(task.content);

	const handleSave = () => {
		onSave({
			...task,
			content
		});
		onOpenChange(false);
	};

    return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
				<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-[90vw] max-w-md">
					<Dialog.Title className="text-xl font-bold mb-4">Editar Tarea</Dialog.Title>

					<div className="space-y-4">
						<div>
							<label htmlFor="content" className="block text-sm font-medium mb-1">
								Contenido
							</label>
							<textarea
								id="task-content"
								className="w-full p-2 border-gray-300 rounded-md"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								rows={4}
							/>
						</div>
					</div>
					<div className="mt-6 flex justify-end space-x-2">
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancelar
						</Button>
						<Button onClick={handleSave}>
							Guardar
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
    );
}
