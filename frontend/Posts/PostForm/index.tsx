'use client';

import { ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Upload } from 'antd';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

import BaseError from '@shared/commons/errors/BaseError';
import { EMPTY_STRING } from '@shared/configs/constants';
import { makeSlug } from '@shared/utils/helper';

import RichEditor from '@frontend/components/commons/RichEditor';
import { AppContext } from '@frontend/components/hocs/WithProvider';
import apiClient from '@frontend/configs/apiClient';

const initialValues = {
	title: EMPTY_STRING,
	slug: EMPTY_STRING,
	content: EMPTY_STRING,
	thumbnail: EMPTY_STRING,
};

const { confirm } = Modal;

export default function PostForm({ post }: any) {
	// Hooks
	const [form] = Form.useForm();
	const router = useRouter();
	const { context } = useContext(AppContext);
	const { t } = useTranslation('common');

	// State
	const [content, setContent] = useState<string>(EMPTY_STRING);
	const [submiting, setSubmiting] = useState<boolean>(false);
	const [published, setPublishState] = useState(false);
	const [disabledUpload, setUploadState] = useState(false);
	const [fileList, setFileList] = useState([]);

	const isEditMode = !!post;
	const isPublished = post?.publishedAt;
	const rules = [{ required: true, message: t('FORM_VALIDATE_REQUIRED') }];

	const attachPublishDate = (formData: any) => {
		if (published) {
			formData.publishedAt = new Date();
		}
		return formData;
	};

	const savePost = async (formData: any) => {
		const body = attachPublishDate(formData);
		setSubmiting(true);
		try {
			const config = {
				method: isEditMode ? 'PATCH' : 'POST',
				url: isEditMode ? `/posts/${post.id}` : '/posts',
				data: body,
			};
			const { data }: AxiosResponse = await apiClient.request(config);

			if (!data?.success) throw new Error('Unable to create post');
			context.toastApi.success({ message: 'Create post successfully' });
			navigateBack();
		} catch (error) {
			context.toastApi.error({ message: (error as BaseError).message });
		} finally {
			form.resetFields();
			setContent(EMPTY_STRING);
			setSubmiting(false);
		}
	};

	const setSlugFieldValue = (title: string) => form.setFieldValue('slug', makeSlug(title));

	const transformFieldToMap = (fields: Array<Object>) => {
		const fieldMap = new Map();
		fields.forEach(({ name, ...restFields }: any) => fieldMap.set(name[0], restFields));
		return fieldMap;
	};

	const handleFieldChange = (changedFields: Array<Object>, allFields: Array<Object>) => {
		const changedFieldsMap = transformFieldToMap(changedFields);
		const allFieldsMap = transformFieldToMap(allFields);

		if (changedFieldsMap.has('title') && changedFieldsMap.get('title').value) {
			setSlugFieldValue(changedFieldsMap.get('title').value);
		}
		setUploadState(allFieldsMap.has('thumbnail') && allFieldsMap.get('thumbnail').value);
	};

	const handleEditorChange = (value: React.SetStateAction<string>) => setContent(value);

	const triggerSubmit =
		(shouldPublish: boolean = false) =>
		() => {
			setPublishState(shouldPublish);
			form.submit();
		};

	const isAllFieldsEmpty = () => {
		const fieldsValues = form.getFieldsValue();
		return Object.values(fieldsValues).every((value) => !value);
	};

	const navigateBack = () => setTimeout(() => router.back(), 250);

	const showConfirmBox = () => {
		confirm({
			title: 'Discard current content ?',
			icon: <ExclamationCircleFilled />,
			content: 'Exit content page without saving current work',
			okText: 'Discard',
			okType: 'danger',
			cancelText: 'Continue editing',
			onOk() {
				navigateBack();
			},
			onCancel() {},
		});
	};

	const cancelForm = () => (isAllFieldsEmpty() ? navigateBack() : showConfirmBox());

	const uploadFile = ({ file, fileList, event }: any) => {
		setFileList(fileList);
		const { response, error } = file;
		if (error) {
			context.toastApi.error({ message: (error as BaseError).message });
		}
		if (response) {
			const { url } = response.data;
			form.setFieldValue('thumbnail', url);
			setFileList([]);
			setUploadState(true);
		}
	};

	useEffect(() => {
		form.setFieldsValue({ content: content });
	}, [content, form]);

	useEffect(() => {
		if (isEditMode) {
			for (let [key, value] of Object.entries(post)) {
				form.setFieldValue(key, value);
				if (key === 'content') {
					setContent(value as string);
				}
			}
		}
	}, [form, isEditMode, post]);

	return (
		<div className="grid grid-cols-12 gap-4">
			<div className="col-span-10">
				<Form
					form={form}
					layout="vertical"
					initialValues={initialValues}
					onFieldsChange={handleFieldChange}
					onFinish={savePost}>
					<Form.Item name="title" label="Title" rules={rules}>
						<Input placeholder="Please type title..." size="large" className="mb-3" disabled={submiting} />
					</Form.Item>
					<Form.Item name="slug" label="Slug" rules={rules}>
						<Input placeholder="Please type slug..." size="large" className="mb-3" disabled={submiting} />
					</Form.Item>
					<div className="flex items-center transition-all">
						<Form.Item name="thumbnail" label="Thumbnail" className="grow">
							<Input placeholder="Thumbnail url" size="large" disabled={submiting} />
						</Form.Item>
						<div className="mt-1 flex items-center">
							<div className="mx-3 text-slate-500">Or</div>
							<Upload
								name="file"
								className="w-44"
								onChange={uploadFile}
								fileList={fileList}
								action={'/api/upload/image'}
								accept="image/png, image/jpeg"
								multiple={false}
								listType="picture"
								disabled={disabledUpload}>
								<Button
									size="large"
									icon={<UploadOutlined />}
									disabled={disabledUpload}
									className="text-slate-400 font-normal w-full">
									Click to upload
								</Button>
							</Upload>
						</div>
					</div>
					<Form.Item label="Content" name="content" rules={rules} className="h-96 relative">
						<RichEditor
							content={content}
							setContent={handleEditorChange}
							placeholder="Please type content..."
							disabled={submiting}
						/>
					</Form.Item>
				</Form>
			</div>
			<div className="col-start-11 col-span-full flex flex-col">
				<div>
					<Button
						onClick={triggerSubmit(true)}
						disabled={submiting}
						loading={submiting}
						className="bg-primary text-slate-100 capitalize w-full mb-2"
						type="primary">
						{isEditMode ? 'save' : 'published'}
					</Button>
					{!isPublished && (
						<Button onClick={triggerSubmit()} disabled={submiting} className="w-full capitalize">
							save draft
						</Button>
					)}
				</div>
				<div className="mt-auto">
					<Button onClick={cancelForm} danger className="w-full capitalize">
						cancel
					</Button>
				</div>
			</div>
		</div>
	);
}
