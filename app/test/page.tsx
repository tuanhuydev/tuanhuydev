'use client';

import { DynamicFormConfig } from '@lib/components/commons/Form/DynamicForm';
import FormBuilder from '@lib/components/commons/Form/FormBuilder';
import MarkdownEditor from '@lib/components/commons/MardownEditor';

export default function Page() {
	// dynamic form
	// dynamic input
	// dynamic validation
	// generate input
	const config: DynamicFormConfig = {
		fields: [
			{
				name: 'email',
				type: 'email',
				options: { placeholder: 'Email' },
				validate: {
					required: true,
				},
			},
			{
				name: 'password',
				type: 'password',
				options: {
					placeholder: 'Password',
				},
				validate: {
					required: true,
				},
			},
			{
				name: 'age',
				type: 'number',
				options: {
					placeholder: 'Age',
				},
				validate: {
					min: 0,
					max: 100,
				},
			},
			{
				name: 'description',
				type: 'textarea',
				options: {
					placeholder: 'Description',
				},
				validate: {
					required: true,
				},
			},
		],
	};

	const submit = (formData: any) => {
		console.log(formData);
	};

	return (
		<>
			{/* <DynamicForm config={config} onSubmit={submit} /> */}
			<FormBuilder />
			<MarkdownEditor value={undefined} />
		</>
	);
}
