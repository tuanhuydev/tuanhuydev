'use client';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import { AxiosResponse } from 'axios';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

import BaseError from '@shared/commons/errors/BaseError';
import { EMPTY_STRING } from '@shared/configs/constants';
import { makeSlug } from '@shared/utils/helper';

import PageContainer from '@frontend/Dashboard/PageContainer';
import RichEditor from '@frontend/components/commons/RichEditor';
import { AppContext } from '@frontend/components/hocs/WithProvider';
import apiClient from '@frontend/configs/httpClient';

const initialValues = {
	title: EMPTY_STRING,
	slug: EMPTY_STRING,
	content: EMPTY_STRING,
};

const { confirm } = Modal;

type Props = {
	// Add custom props here
};

export default function Page(_props: InferGetStaticPropsType<typeof getStaticProps>) {
	// Hooks
	const [form] = Form.useForm();
	const router = useRouter();
	const { t } = useTranslation('common');
	const { context } = useContext(AppContext);

	// State
	const [content, setContent] = useState<string>(EMPTY_STRING);
	const [submiting, setSubmiting] = useState<boolean>(false);
	const [published, setPublishState] = useState(false);

	const attachPublishDate = (formData: any) => {
		if (published) {
			formData.publishedAt = new Date();
		}
		return formData;
	};

	const createNewPost = async (formData: any) => {
		const body = attachPublishDate(formData);

		setSubmiting(true);
		try {
			// TODO: Sync local state
			const { data }: AxiosResponse = await apiClient.post('/posts', body);
			const { success } = data;
			if (success) {
				context.toastApi.success({ message: 'Create post successfully' });
				navigateBack();
			} else {
				throw new Error('Unable to create post');
			}
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

	const handleFieldChange = (changedFields: Array<Object>) => {
		const changedFieldsMap = transformFieldToMap(changedFields);

		if (changedFieldsMap.has('title') && changedFieldsMap.get('title').value) {
			setSlugFieldValue(changedFieldsMap.get('title').value);
		}
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
			onOk: navigateBack,
			onCancel() {},
		});
	};

	const cancelForm = () => (isAllFieldsEmpty() ? navigateBack() : showConfirmBox());

	useEffect(() => {
		form.setFieldsValue({ content: content });
	}, [content, form]);

	// const rules = [{ required: true, message: 'this is required field' }];
	const rules = [{ required: true, message: t('thanks') }];

	return (
		<PageContainer title="Create new post">
			<div className="grid grid-cols-12 gap-4">
				<div className="col-span-10">
					<Form
						form={form}
						layout="vertical"
						initialValues={initialValues}
						onFieldsChange={handleFieldChange}
						onFinish={createNewPost}>
						<Form.Item name="title" label="Title" rules={rules}>
							<Input placeholder="Please type title..." size="large" className="mb-4" disabled={submiting} />
						</Form.Item>

						<Form.Item name="slug" label="Slug" rules={rules}>
							<Input
								placeholder="Please type slug..."
								defaultValue={EMPTY_STRING}
								size="large"
								className="mb-4"
								disabled={submiting}
							/>
						</Form.Item>

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
							published
						</Button>
						<Button onClick={triggerSubmit()} disabled={submiting} className="w-full capitalize">
							save draft
						</Button>
					</div>
					<div className="mt-auto">
						<Button onClick={cancelForm} danger className="w-full capitalize">
							cancel
						</Button>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
	props: { ...(await serverSideTranslations(locale ?? 'en', ['common'])) },
});
