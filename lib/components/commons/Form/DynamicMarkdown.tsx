import { ObjectType } from '@lib/shared/interfaces/base';
import React from 'react';
import { UseControllerProps, useController } from 'react-hook-form';

import MarkdownEditor from '../MardownEditor';

export interface DynamicMarkdownProps extends UseControllerProps<any> {
	type: 'text' | 'email' | 'password' | 'number' | 'textarea';
	options?: ObjectType;
	keyProp?: string;
}

export default function DynamicMarkdown({ ...restProps }: DynamicMarkdownProps) {
	const { field, fieldState, formState } = useController(restProps);

	return <MarkdownEditor {...field} />;
}
