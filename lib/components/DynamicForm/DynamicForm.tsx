'use client';

import { ObjectType } from '@lib/shared/interfaces/base';
import { Form } from 'antd';
import React from 'react';
import { useState } from 'react';

import Builder from './Builder';
import FieldStack from './FieldStack';
import Preview from './Preview';

export default function DynamicForm() {
	const [fieldForm] = Form.useForm();
	const [fields, setFields] = useState<any[]>([]);

	const addField = (newField: ObjectType) => setFields([...fields, newField]);

	const removeField = ({ name }: ObjectType) => setFields((fields) => fields.filter((field) => field.name !== name));

	return (
		<div className="flex justify-center flex-wrap gap-5">
			<Builder form={fieldForm} onAdd={addField} onRemove={removeField} />
			<FieldStack fields={fields} onRemove={removeField} />
			<Preview fields={fields} />
		</div>
	);
}
