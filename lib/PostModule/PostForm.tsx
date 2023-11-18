'use client';

import { UploadOutlined } from '@ant-design/icons';
import Loader from '@lib/components/commons/Loader';
import { EMPTY_STRING } from '@lib/configs/constants';
import { ObjectType } from '@lib/shared/interfaces/base';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { PostAsset } from '@prisma/client';
import { App, Button, Form, Input, Upload } from 'antd';
import Cookies from 'js-cookie';
import { useCreatePostMutation, useUpdatePostMutation } from 'lib/store/slices/apiSlice';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import BaseError from '@shared/commons/errors/BaseError';
import { isURLValid, transformTextToDashed } from '@shared/utils/helper';

const MarkdownEditor = dynamic(() => import('@lib/components/commons/MardownEditor'), { ssr: false });

const initialValues = {
	title: EMPTY_STRING,
	slug: EMPTY_STRING,
	content: EMPTY_STRING,
	thumbnail: EMPTY_STRING,
};

export default function PostForm({ post }: any) {
	const editorRef = useRef<MDXEditorMethods | null>(null);

	// Hooks
	const [form] = Form.useForm();
	const router = useRouter();
	const { notification } = App.useApp();

	const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
	const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

	// State
	const [content, setContent] = useState<string>(EMPTY_STRING);
	const [published, setPublished] = useState(false);
	const [disabledUpload, setDisabledUpload] = useState(false);
	const [fileList, setFileList] = useState([]);
	const [assets, setAssets] = useState([]);

	const submitting = isCreating || isUpdating;

	const isEditMode = !!post;
	const isPublished = post?.publishedAt;
	const rules = [{ required: true, message: 'This field is required' }];

	const attachPublishDate = useCallback(
		(formData: any) => {
			if (published) {
				formData.publishedAt = new Date();
			}
			return formData;
		},
		[published]
	);

	const navigateBack = useCallback(() => router.back(), [router]);

	const savePost = useCallback(
		async (formData: any) => {
			const body = attachPublishDate(formData);
			body.assets = assets;

			try {
				const { data }: any = isEditMode ? await updatePost({ id: post?.id, body }) : await createPost(body);
				if (!data?.success) throw new Error('Unable to save');

				notification.success({ message: 'Save successfully' });
				navigateBack();
			} catch (error) {
				notification.error({ message: (error as BaseError).message });
			} finally {
				if (!isEditMode) form.resetFields();
				setContent(EMPTY_STRING);
			}
		},
		[assets, attachPublishDate, createPost, form, isEditMode, navigateBack, notification, post?.id, updatePost]
	);

	const setSlugFieldValue = useCallback(
		(title: string) => form.setFieldValue('slug', transformTextToDashed(title)),
		[form]
	);

	const transformFieldToMap = useCallback((fields: Array<Object>) => {
		const fieldMap = new Map();
		fields.forEach(({ name, ...restFields }: any) => fieldMap.set(name[0], restFields));
		return fieldMap;
	}, []);

	const handleFieldChange = useCallback(
		(changedFields: Array<Object>, allFields: Array<Object>) => {
			const changedFieldsMap = transformFieldToMap(changedFields);
			const allFieldsMap = transformFieldToMap(allFields);
			const shouldOverrideSlug =
				!changedFieldsMap.has('slug') && changedFieldsMap.has('title') && changedFieldsMap.get('title').value;
			if (shouldOverrideSlug) {
				setSlugFieldValue(transformTextToDashed(changedFieldsMap.get('title').value));
			}
			setDisabledUpload(allFieldsMap.has('thumbnail') && allFieldsMap.get('thumbnail').value);
		},
		[setSlugFieldValue, transformFieldToMap]
	);

	const handleEditorChange = useCallback((value: string) => setContent(value), []);

	const updatePostAssets = useCallback((asset: ObjectType) => {
		setAssets((prevAssets) => [...prevAssets, asset.id] as never);
	}, []);

	const triggerSubmit = useCallback(
		(shouldPublish: boolean = false) =>
			() => {
				setPublished(shouldPublish);
				form.submit();
			},
		[form]
	);

	const uploadFile = ({ file, fileList }: any) => {
		setFileList(fileList);
		const { response = {}, error } = file;
		const { data: asset } = response;
		if (error) notification.error({ message: (error as BaseError).message });
		if (asset) {
			updatePostAssets(asset);
			form.setFieldValue('thumbnail', asset.url);

			setFileList([]);
			setDisabledUpload(true);
		}
	};

	const validateUrl = (ruleObject: any, value: string) => {
		return isURLValid(value) || !value ? Promise.resolve() : Promise.reject(new Error('Please enter a valid URL'));
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
					editorRef.current?.setMarkdown(value as string);
				} else if (key === 'PostAsset') {
					const assets = (value as Array<Partial<PostAsset>>).map(({ assetId }) => assetId);
					setAssets(assets as never);
				}
			}
		}
	}, [form, isEditMode, post]);

	return (
		<div className="grid grid-cols-4 lg:grid-cols-12 grid-rows-2 gap-4" data-testid="post-form-testid">
			<div className="col-span-full lg:col-span-10">
				<Form
					form={form}
					layout="vertical"
					initialValues={initialValues}
					onFieldsChange={handleFieldChange}
					onFinish={savePost}>
					<Form.Item name="title" rules={rules}>
						<Input placeholder="Title" size="large" className="mb-3" disabled={submitting} />
					</Form.Item>
					<Form.Item name="slug" rules={rules}>
						<Input placeholder="Slug" size="large" className="mb-3" disabled={submitting} />
					</Form.Item>
					<div className="flex items-center transition-all">
						<Form.Item name="thumbnail" className="grow" rules={[{ validator: validateUrl }]}>
							<Input placeholder="Thumbnail URL" size="large" disabled={submitting} />
						</Form.Item>
						<div className="mb-6 flex items-center">
							<div className="mx-3 text-slate-500">Or</div>
							<Upload
								name="file"
								className="w-44"
								onChange={uploadFile}
								fileList={fileList}
								action="/api/upload/image"
								headers={{ Authorization: `Bearer ${Cookies.get('jwt')}` }}
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
					<Form.Item name="content" rules={rules}>
						<Suspense fallback={<Loader />}>
							<MarkdownEditor onChange={handleEditorChange} value={content} />
						</Suspense>
					</Form.Item>
				</Form>
			</div>
			<div className="col-span-full md:col-span-1 lg:col-span-full row-start-auto col-start-1 lg:col-start-11 gap-3 flex lg:flex-col">
				<Button
					onClick={triggerSubmit(true)}
					disabled={submitting}
					loading={submitting}
					className="bg-primary text-slate-100 capitalize mb-2"
					type="primary">
					{isEditMode ? 'Save' : 'Publish'}
				</Button>
				{!isPublished && (
					<Button onClick={triggerSubmit()} disabled={submitting} className="capitalize">
						Save draft
					</Button>
				)}
			</div>
		</div>
	);
}
