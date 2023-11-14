'use client';

import { ObjectType } from '@lib/shared/interfaces/base';
import React from 'react';
import { UseControllerProps, useController } from 'react-hook-form';

import MarkdownEditor from '../MardownEditor';

export interface DynamicMarkdownProps extends UseControllerProps<any> {
	options?: ObjectType;
	keyProp?: string;
	className?: string;
}

export default function DynamicMarkdown({
	keyProp,
	options,
	className = 'w-full',
	...restProps
}: DynamicMarkdownProps) {
	const { field, fieldState, formState } = useController(restProps);
	const { isSubmitting } = formState;
	const { invalid, error } = fieldState;

	return (
		<div className={`pr-2 pb-2 self-stretch ${className}`}>
			<div className=" mb-1">
				<MarkdownEditor key={keyProp} {...field} {...options} />
			</div>
			{invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
		</div>
	);
}
