export interface FieldType<T> {
	name: string;
	type: string;
	label?: string;
	options?: Partial<T>;
	validate: boolean;
}

export { default as DynamicForm } from './DynamicForm';
