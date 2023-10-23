'use client';

import { ObjectType } from '@lib/shared/interfaces/base';
import { Select } from 'antd';
import Cookies from 'js-cookie';
import { headers } from 'next/headers';
import React, { useCallback, useEffect, useState } from 'react';
import { UseControllerProps, useController } from 'react-hook-form';

export interface DynamicSelectProps extends UseControllerProps<any> {
	options?: ObjectType;
	keyProp?: string;
	className?: string;
}

export default function DynamicSelect({
	options: selectOptions = {},
	keyProp,
	className = 'w-full',
	...restProps
}: DynamicSelectProps) {
	const { options: staticOptions = [], remote, ...restSelectOptions } = selectOptions;

	const [options, setOptions] = useState(staticOptions);

	const { field, fieldState, formState } = useController(restProps);
	const { isSubmitting } = formState;
	const { invalid, error } = fieldState;

	const fetchOptions = useCallback(async () => {
		const { url, label, value } = remote;
		const response = await fetch(url, {
			cache: 'no-store',
			headers: {
				authorization: `Bearer ${Cookies.get('jwt')}`,
			},
		});
		if (!response.ok) return [];

		const { data: options = [] } = await response.json();
		return await options.map((option: ObjectType) => ({ label: option[label], value: option[value] }));
	}, [remote]);

	useEffect(() => {
		if (remote)
			fetchOptions().then((options) => {
				setOptions(options);
			});
	}, [fetchOptions, remote]);

	return (
		<div className={`pr-2 pb-2 self-stretch ${className}`}>
			<div className=" mb-1">
				<Select
					key={keyProp}
					{...field}
					{...restSelectOptions}
					options={options}
					className="w-full"
					disabled={isSubmitting}
				/>
			</div>
			{invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
		</div>
	);
}
