import { Column } from "@/components/BoardColumn"
import { Task } from "@/components/TaskCard"

export interface TaskProps {
	id: string
	title: string
	description: string
	assignee: string
	bg_color: string
	status?: string
	column_id: string
}

export interface ColumnProps {
	id: string
	title: string
	color?: string
	tasks: Task[]
	kanban_id: string
}

export interface KanbanProps {
	id: string
	title?: string
	columns: Column[]
}

export interface ButtonsProps {

}

export interface Scroll_AreaProps {
	
}

export interface Dropdown_MenuProps {
	
}