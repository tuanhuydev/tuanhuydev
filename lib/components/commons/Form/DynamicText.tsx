import { ObjectType } from '@lib/shared/interfaces/base';
import { Input, InputNumber } from 'antd';
import React from 'react';
import { UseControllerProps, useController } from 'react-hook-form';

export interface DynamicInputProps extends UseControllerProps<any> {
	type: 'text' | 'email' | 'password' | 'number' | 'textarea';
	options?: ObjectType;
	keyProp?: string;
}

export default function DynamicText({ type, options, keyProp, ...restProps }: DynamicInputProps) {
	const { field, fieldState } = useController(restProps);
	const { invalid } = fieldState;

	let element;
	console.log(keyProp);
	switch (type) {
		case 'password':
			element = <Input.Password key={keyProp} {...field} {...options} />;
			break;
		case 'number':
			element = <InputNumber key={keyProp} {...field} {...options} className="w-full" />;
			break;
		case 'textarea':
			element = <Input.TextArea key={keyProp} {...field} {...options} rows={4} />;
			break;
		default:
			element = <Input key={keyProp} {...field} {...options} type={type} />;
			break;
	}
	return (
		<div className="mb-4">
			<div className="w-full">{element}</div>
			{invalid && <div>invalid</div>}
		</div>
	);
}
