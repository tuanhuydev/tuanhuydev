'use client';

import dynamic from 'next/dynamic';
import React, { ForwardedRef } from 'react';

import Loader from '../Loader';

const BaseMarkdown = dynamic(() => import('@lib/components/commons/MardownEditor/BaseMarkdown'), {
	ssr: false,
	loading: () => <Loader />,
});

export interface MarkdownProps {
	onChange?: (value: string) => void;
	placeholder?: string;
	value: any;
}

export default React.forwardRef(function MarkdownEditor(
	{ onChange, value, placeholder = 'Placeholder' }: MarkdownProps,
	ref: ForwardedRef<any> | null
) {
	return (
		<div
			className="flex flex-col md:flex-row gap-4 !border !border-solid !border-slate-300 hover:!border-primary rounded h-fit"
			ref={ref}>
			<div className="flex-1 relative">
				<BaseMarkdown markdown={value} onChange={onChange} placeholder={placeholder} />
			</div>
		</div>
	);
});
