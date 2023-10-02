'use client';

import { EMPTY_STRING } from '@lib/configs/constants';
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import React, { ChangeEvent, memo, useCallback, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';

import { RichEditorProps } from '.';

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

const modules = {
	toolbar: [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
		['link', 'image'],
		['clean'],
	],
};

const Quill = ({ content, setContent, disabled, QuillProps, onFileUpload }: RichEditorProps) => {
	const quillRef = useRef(null);

	const uploadFileToS3 = useCallback(
		async (file: File): Promise<string> => {
			let formData = new FormData();
			formData.append('file', file);
			const { data: response }: AxiosResponse = await axios.post('/api/upload/image', formData, {
				headers: {
					Authorization: `Bearer ${Cookies.get('jwt')}`,
				},
			});
			const { data: asset, success } = response;
			if (!success) return EMPTY_STRING;

			if (onFileUpload) onFileUpload(asset);
			return asset.url;
		},
		[onFileUpload]
	);

	const selectImage = useCallback(
		async (event: ChangeEvent<HTMLInputElement>) => {
			const files = event.target.files || [];
			const editorInstance = quillRef.current;
			if (!editorInstance || !files.length) return;

			const currentFile = files[0];
			const editor = (editorInstance as ReactQuill).getEditor();
			const imageUrl = await uploadFileToS3(currentFile);
			const range = editor.getSelection();
			if (imageUrl && range) editor.insertEmbed(range.index, 'image', imageUrl);
		},
		[uploadFileToS3]
	);

	const uploadImage = useCallback(() => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.onchange = (event: Event) => selectImage(event as unknown as React.ChangeEvent<HTMLInputElement>);
		input.click();
	}, [selectImage]);

	useEffect(() => {
		if (quillRef.current) {
			const quill = (quillRef.current as ReactQuill).getEditor();
			quill.getModule('toolbar').addHandler('image', uploadImage);
		}
	}, [uploadImage]);

	return (
		<div className="h-96">
			<ReactQuill
				{...QuillProps}
				ref={quillRef}
				style={{ height: 'calc(24rem - 50px)' }}
				readOnly={disabled}
				modules={modules}
				formats={formats}
				value={content}
				onChange={setContent}
			/>
		</div>
	);
};

export default memo(Quill);
