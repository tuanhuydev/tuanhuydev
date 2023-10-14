'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import DynamicText from '@lib/components/commons/Form/DynamicText';
import { ObjectType } from '@lib/shared/interfaces/base';
import { Button } from 'antd';
import { Fragment, useMemo } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import DynamicSelect from './DynamicSelect';

export interface ElementType {
	name: string;
	type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select';
	label?: 'string';
	options?: {};
	validate?: {};
}

export interface DynamicFormProps {
	config: DynamicFormConfig;
	onSubmit: SubmitHandler<FieldValues>;
}
export interface DynamicFormConfig {
	fields: ElementType[];
}

const mapValidation = (type: any, validate: ObjectType) => {
	// make yup base on type
	let rule;
	if (type === 'number') {
		rule = yup.number();
	} else {
		rule = yup.string();
	}

	// Apply rules
	if ('min' in validate) {
		rule = rule.min(validate.min);
	}
	if ('max' in validate) {
		rule = rule.max(validate.max);
	}
	if ('required' in validate && validate.required) {
		rule = rule.required();
	}
	return rule;
};

const makeSchema = ({ fields }: DynamicFormConfig) => {
	const schema: ObjectType = {};
	fields.forEach(({ name, validate, type }: ElementType) => {
		if (validate) schema[name] = mapValidation(type, validate);
	});

	return yup.object(schema);
};

export default function DynamicForm({ config, onSubmit }: DynamicFormProps) {
	const { handleSubmit, control } = useForm({ resolver: yupResolver(makeSchema(config)) });
	const { fields } = config;

	const registerFields = useMemo(
		() =>
			(fields as Array<ElementType>).map((field: ElementType) => {
				const { name, type, options } = field;
				if (type === 'select') {
					return <DynamicSelect control={control} name={name} options={options} key={name} keyProp={name} />;
				}
				return (
					<DynamicText
						control={control}
						name={name}
						type={type}
						options={options}
						key={name}
						keyProp={`${name} - ${type}`}
					/>
				);
			}),
		[control, fields]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{registerFields}
			<Button htmlType="submit">Submit</Button>
		</form>
	);
}
