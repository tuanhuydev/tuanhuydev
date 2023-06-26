'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { ReactQuillProps } from 'react-quill';

const Editor = dynamic(() => import('react-quill'), { ssr: false });

export interface EditorProps extends ReactQuillProps {
	content: string;
	setContent: (value: string) => void;
	disabled?: boolean;
}
export default function RichEditor({ content, setContent, disabled, ...restProps }: Partial<EditorProps>) {
	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image'],
			['clean'],
		],
	};

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
	];
	return (
		<div className="h-96">
			<Editor
				{...restProps}
				style={{ height: 'calc(24rem - 50px)' }}
				readOnly={disabled}
				modules={modules}
				formats={formats}
				value={content}
				onChange={setContent}
			/>
		</div>
	);
}
