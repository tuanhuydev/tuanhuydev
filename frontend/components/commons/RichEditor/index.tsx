import dynamic from 'next/dynamic';
import React, { memo } from 'react';
import { ReactQuillProps } from 'react-quill';

const Editor = dynamic(() => import('./Quill'), { ssr: false });

export interface RichEditorProps {
	content: string;
	setContent: (value: string) => void;
	disabled?: boolean;
	QuillProps: Partial<ReactQuillProps>;
}

const RichEditor = (props: RichEditorProps) => {
	return <Editor {...props} />;
};

export default RichEditor;
