import { ObjectType } from '@lib/shared/interfaces/base';
import { Input, InputNumber, message } from 'antd';
import React from 'react';
import { UseControllerProps, useController, useFormState } from 'react-hook-form';

export interface DynamicInputProps extends UseControllerProps<any> {
	type: 'text' | 'email' | 'password' | 'number' | 'textarea';
	options?: ObjectType;
	keyProp?: string;
}

export default function DynamicText({ type, options, keyProp, ...restProps }: DynamicInputProps) {
	const { field, fieldState, formState } = useController(restProps);
	const { isSubmitting } = formState;
	const { invalid, error } = fieldState;
	let element;
	console.log(keyProp);
	switch (type) {
		case 'password':
			element = <Input.Password key={keyProp} {...field} {...options} disabled={isSubmitting} />;
			break;
		case 'number':
			element = <InputNumber key={keyProp} {...field} {...options} className="w-full" disabled={isSubmitting} />;
			break;
		case 'textarea':
			element = <Input.TextArea key={keyProp} {...field} {...options} rows={4} disabled={isSubmitting} />;
			break;
		default:
			element = <Input key={keyProp} {...field} {...options} type={type} disabled={isSubmitting} />;
			break;
	}
	return (
		<div className="pb-2">
			<div className="w-full mb-1">{element}</div>
			{invalid && <div className="text-sm font-light text-red-500 capitalize">{error?.message}</div>}
		</div>
	);
}
