'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectType } from '@lib/shared/interfaces/base';
import { Button, ButtonProps } from 'antd';
import dynamic from 'next/dynamic';
import { ReactNode, useMemo } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

const DynamicText = dynamic(() => import('@lib/components/commons/Form/DynamicText'), { ssr: false });
const DynamicSelect = dynamic(() => import('@lib/components/commons/Form/DynamicSelect'), { ssr: false });
const DynamicMarkdown = dynamic(() => import('@lib/components/commons/Form/DynamicMarkdown'), { ssr: false });
const DynamicDatepicker = dynamic(() => import('@lib/components/commons/Form/DynamicDatepicker'), { ssr: false });

export interface ElementType {
	name: string;
	type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'richeditor' | 'datepicker';
	label?: 'string';
	options?: {};
	validate?: {};
	style?: {};
	className?: string;
}

export interface DynamicFormProps {
	config: DynamicFormConfig;
	onSubmit: SubmitHandler<FieldValues>;
	submitProps?: Partial<ButtonProps>;
	customSubmit?: ReactNode;
}
export interface DynamicFormConfig {
	fields: ElementType[];
}

const mapValidation = (type: any, validate: ObjectType) => {
	// make yup base on type
	let rule;
	if (type === 'number') {
		rule = yup.number();
	} else if (type === 'datepicker') {
		rule = yup.date();
	} else if (type === 'select') {
		rule = yup.array();
	} else {
		rule = yup.string();
	}

	// Apply rules
	if ('min' in validate) {
		const isNumberMin = Number.isInteger(validate.min);
		rule = rule.min(isNumberMin ? validate.min : yup.ref(validate.min));
	}
	if ('max' in validate) {
		const isNumberMax = Number.isInteger(validate.max);
		rule = rule.max(isNumberMax ? validate.max : yup.ref(validate.max));
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

export default function DynamicForm({ config, onSubmit, submitProps }: DynamicFormProps) {
	const form = useForm({ resolver: yupResolver(makeSchema(config)) });
	const {
		handleSubmit,
		control,
		formState: { isLoading, isSubmitting },
	} = form;
	const { fields } = config;

	const registerFields = useMemo(
		() =>
			(fields as Array<ElementType>).map((field: ElementType) => {
				const { name, type, options, ...restFieldProps } = field;
				const elementProps = {
					control,
					name,
					options,
					keyProp: name,
				};
				switch (type) {
					case 'select':
						return <DynamicSelect key={name} {...elementProps} {...restFieldProps} />;
					case 'richeditor':
						return <DynamicMarkdown key={name} {...elementProps} {...restFieldProps} />;
					case 'datepicker':
						return <DynamicDatepicker key={name} {...elementProps} {...restFieldProps} />;
					default:
						return (
							<DynamicText key={name} {...elementProps} {...restFieldProps} type={type} keyProp={`${name} - ${type}`} />
						);
				}
			}),
		[control, fields]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-wrap">{registerFields}</div>
			<div className="flex pr-2 pb-2">
				<Button {...submitProps} type="primary" htmlType="submit" loading={isLoading} disabled={isSubmitting}>
					Submit
				</Button>
			</div>
		</form>
	);
}
