'use client';

import { ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons';
import { ObjectType } from '@lib/shared/interfaces/base';
import { PostAsset } from '@prisma/client';
import { Button, Form, Input, Modal, Upload } from 'antd';
import Cookies from 'js-cookie';
import RichEditor from 'lib/components/commons/RichEditor';
import { AppContext } from 'lib/components/hocs/WithProvider';
import { useCreatePostMutation, useUpdatePostMutation } from 'lib/store/slices/apiSlice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import BaseError from '@shared/commons/errors/BaseError';
import { EMPTY_STRING } from '@shared/configs/constants';
import { isURLValid, transformTextToDashed } from '@shared/utils/helper';

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
	const { t: translate } = useTranslation('common');
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
	const rules = [{ required: true, message: translate('FORM_VALIDATE_REQUIRED') }];

	const attachPublishDate = useCallback(
		(formData: any) => {
			if (published) {
				formData.publishedAt = new Date();
			}
			return formData;
		},
		[published]
	);

	const navigateBack = useCallback(() => setTimeout(() => router.back(), 250), [router]);

	const savePost = useCallback(
		async (formData: any) => {
			const body = attachPublishDate(formData);
			body.slug = transformTextToDashed(formData.slug);
			body.assets = assets;

			try {
				const { data }: any = isEditMode ? await updatePost({ id: post.id, body }) : await createPost(body);
				if (!data?.success) throw new Error('Unable to save');

				context.notify?.success({ message: 'Save successfully' });
				navigateBack();
			} catch (error) {
				context.notify?.error({ message: (error as BaseError).message });
			} finally {
				if (!isEditMode) form.resetFields();

				setContent(EMPTY_STRING);
			}
		},
		[assets, attachPublishDate, context.notify, createPost, form, isEditMode, navigateBack, post.id, updatePost]
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
				setSlugFieldValue(changedFieldsMap.get('title').value);
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

	const isAllFieldsEmpty = useCallback(() => {
		const fieldsValues = form.getFieldsValue();
		return Object.values(fieldsValues).every((value) => !value);
	}, [form]);

	const showConfirmBox = useCallback(() => {
		confirm({
			title: 'Discard current content?',
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
	}, [navigateBack]);

	const cancelForm = useCallback(
		() => (isAllFieldsEmpty() ? navigateBack() : showConfirmBox()),
		[isAllFieldsEmpty, navigateBack, showConfirmBox]
	);

	const uploadFile = ({ file, fileList, event }: any) => {
		setFileList(fileList);
		const { response = {}, error } = file;
		const { data: asset } = response;
		if (error) context.notify.error({ message: (error as BaseError).message });
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
				} else if (key === 'PostAsset') {
					const assets = (value as Array<Partial<PostAsset>>).map(({ assetId }) => assetId);
					setAssets(assets as never);
				}
			}
		}
	}, [form, isEditMode, post]);

	return (
		<div className="grid grid-cols-12 gap-4" data-testid="post-form-testid">
			<div className="col-span-10">
				<Form
					form={form}
					layout="vertical"
					initialValues={initialValues}
					onFieldsChange={handleFieldChange}
					onFinish={savePost}>
					<Form.Item name="title" label="Title" rules={rules}>
						<Input placeholder="Please type title..." size="large" className="mb-3" disabled={submitting} />
					</Form.Item>
					<Form.Item name="slug" label="Slug" rules={rules}>
						<Input placeholder="Please type slug..." size="large" className="mb-3" disabled={submitting} />
					</Form.Item>
					<div className="flex items-center transition-all">
						<Form.Item name="thumbnail" label="Thumbnail" className="grow" rules={[{ validator: validateUrl }]}>
							<Input placeholder="Thumbnail URL" size="large" disabled={submitting} />
						</Form.Item>
						<div className="mt-1 flex items-center">
							<div className="mx-3 text-slate-500">Or</div>
							<Upload
								name="file"
								className="w-44"
								onChange={uploadFile}
								fileList={fileList}
								action="/api/upload/image"
								headers={{
									Authorization: `Bearer ${Cookies.get('jwt')}`,
								}}
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
							onFileUpload={updatePostAssets}
							QuillProps={{
								placeholder: 'Please type content...',
							}}
							disabled={submitting}
						/>
					</Form.Item>
				</Form>
			</div>
			<div className="col-start-11 col-span-full flex flex-col">
				<div>
					<Button
						onClick={triggerSubmit(true)}
						disabled={submitting}
						loading={submitting}
						className="bg-primary text-slate-100 capitalize w-full mb-2"
						type="primary">
						{isEditMode ? 'Save' : 'Publish'}
					</Button>
					{!isPublished && (
						<Button onClick={triggerSubmit()} disabled={submitting} className="w-full capitalize">
							Save draft
						</Button>
					)}
				</div>
				<div className="mt-auto">
					<Button onClick={cancelForm} danger className="w-full capitalize">
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}
