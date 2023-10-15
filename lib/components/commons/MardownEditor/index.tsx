'use client';

import { EMPTY_STRING } from '@lib/configs/constants';
import { MDXEditorMethods } from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
import rehypeRaw from 'rehype-raw';

const BaseMarkdown = dynamic(() => import('@lib/components/commons/MardownEditor/BaseMarkdown'), { ssr: false });
const MarkdownPreview = dynamic(() => import('react-markdown'), { ssr: false });

export interface MarkdownProps {
	onChange?: (value: string) => void;
	value: any;
}

export default function MarkdownEditor({ onChange, value = EMPTY_STRING }: MarkdownProps) {
	const editorRef = useRef<MDXEditorMethods | null>(null);

	useEffect(() => {
		const editor = editorRef.current;
		if (!editor?.getMarkdown() && value) editor?.setMarkdown(value);
	}, [value]);

	return (
		<div className="flex flex-col md:flex-row gap-4 !border !border-solid !border-slate-300 rounded h-fit">
			<div className="flex-1 relative">
				<BaseMarkdown markdown={value} editorRef={editorRef} onChange={onChange} />
			</div>
			<div className="flex-1 p-3 relative">
				<div className="text-lg font-bold mb-3">Preview</div>
				<div className="!border !border-solid !border-slate-300 rounded p-3">
					<MarkdownPreview rehypePlugins={[rehypeRaw]}>{editorRef.current?.getMarkdown()}</MarkdownPreview>
				</div>
			</div>
		</div>
	);
}
