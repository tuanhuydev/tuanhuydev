import { ObjectType } from '@lib/shared/interfaces/base';
import { Select } from 'antd';
import React from 'react';
import { UseControllerProps, useController } from 'react-hook-form';

export interface DynamicSelectProps extends UseControllerProps<any> {
	options?: ObjectType;
	keyProp?: string;
}

export default function DynamicSelect({ options, keyProp, ...restProps }: DynamicSelectProps) {
	const { field, fieldState } = useController(restProps);
	return <Select key={keyProp} {...field} {...options} style={{ width: '100%' }} />;
}
