import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';
import Image from 'next/image';
import React, { useState } from 'react';

import { EMPTY_STRING } from '@shared/configs/constants';

import apiClient from '@frontend/configs/apiClient';

export default function Page() {
	const [selectedFile, setFile] = useState(null);
	const [imageUrl, setUrl] = useState<string>(EMPTY_STRING);

	const onFileChange = async (event: any) => {
		event.preventDefault();
		setFile(event.target.files[0]);
		let formData = new FormData();
		formData.append('file', event.target.files[0]);
		const { data: response }: AxiosResponse = await axios.post('/api/upload/image', formData);
		const { data, success } = response;
		if (success) {
			setUrl(data.url);
		}
	};

	const submit = async () => {
		try {
			if (!selectedFile) throw new Error('File not found');
			const formData = new FormData();

			formData.append('image', selectedFile);
			const boundary = crypto.randomBytes(16).toString('hex'); // Generate a unique boundary string
			const { data }: AxiosResponse = await apiClient.post('/upload/image', formData, {
				headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<form>
				<input type="file" id="myFile" name="filename" onChange={onFileChange} />
				<button type="button" onClick={submit}>
					Submit
				</button>
			</form>
			{imageUrl && <Image src={imageUrl} width={300} height={200} alt="test file" />}
		</>
	);
}
