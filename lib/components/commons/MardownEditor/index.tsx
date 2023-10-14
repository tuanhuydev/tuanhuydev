'use client';

import { EMPTY_STRING } from '@lib/configs/constants';
import { MDXEditorMethods } from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import rehypeRaw from 'rehype-raw';

const BaseMarkdown = dynamic(() => import('@lib/components/commons/MardownEditor/BaseMarkdown'), { ssr: false });
const MarkdownPreview = dynamic(() => import('react-markdown'), { ssr: false });

export default function MarkdownEditor() {
	const [content, setContent] = useState<string>(EMPTY_STRING);

	const editorRef = useRef<MDXEditorMethods | null>(null);

	useEffect(() => {
		const interval = setInterval(() => {
			const editor = editorRef.current;
			if (editor) setContent(editor?.getMarkdown());
		}, 500);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex gap-4">
			<div className="flex-1">
				<BaseMarkdown markdown={content} editorRef={editorRef} />
			</div>
			<div className="flex-1">
				<MarkdownPreview rehypePlugins={[rehypeRaw]}>{content}</MarkdownPreview>
			</div>
		</div>
	);
}
