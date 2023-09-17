'use client';

import { ObjectType } from '@lib/shared/interfaces/base';
import { Button, Form, FormInstance, Input, Radio, Select } from 'antd';
import React, { Fragment, useEffect } from 'react';

const { Option } = Select;

const renderOptions = (fieldType: string) => {
	switch (fieldType) {
		case 'TEXT':
			return (
				<Fragment>
					<Form.Item name="placeholder">
						<Input placeholder="Input placeholder" />
					</Form.Item>
					<Form.Item name="type">
						<Select>
							<Option value="text">Text</Option>
							<Option value="email">Email</Option>
							<Option value="password">Password</Option>
							<Option value="number">Number</Option>
						</Select>
					</Form.Item>
				</Fragment>
			);
		case 'SELECT':
			return (
				<Fragment>
					<Form.Item name="placeholder">
						<Input placeholder="Input placeholder" />
					</Form.Item>
				</Fragment>
			);
		default:
			return <Fragment />;
	}
};

export interface BuilderProps {
	form: any;
	onAdd: (fieldValues: ObjectType) => void;
}

export default function Builder({ form, onAdd }: any) {
	const [fieldOptionForm] = Form.useForm();

	const fieldType = Form.useWatch('type', form);
	const fieldRules = [{ required: true }];

	const addField = (fieldValues: ObjectType) => {
		onAdd({
			...fieldValues,
			options: fieldOptionForm.getFieldsValue(),
		});
		resetField();
	};

	const resetField = () => {
		form.resetFields();
		fieldOptionForm.resetFields();
	};

	useEffect(() => {
		form.setFieldValue('validate', 'required');

		if (fieldType === 'TEXT') {
			fieldOptionForm.setFieldsValue({
				placeholder: 'Please Input',
				type: 'text',
			});
		}
	}, [form, fieldOptionForm, fieldType]);

	return (
		<div className="grow flex-1 self-stretch min-w-[300px] border rounded p-3">
			<h2 className="text-xl font-semibold mb-3">Builder</h2>
			<Form layout="vertical" form={form} onFinish={addField} onAbort={resetField}>
				<Form.Item name="name" className="mb-4" rules={fieldRules}>
					<Input placeholder="Field Name" type="text" />
				</Form.Item>
				<Form.Item name="type" className="mb-5" rules={fieldRules}>
					<Select placeholder="Select">
						<Option value="TEXT">Text</Option>
						<Option value="SELECT">Select</Option>
					</Select>
				</Form.Item>
				<Form.Item name="validate" className="mb-5">
					<Radio.Group>
						<Radio value="required">Required</Radio>
						<Radio value="optional">Optional</Radio>
					</Radio.Group>
				</Form.Item>
			</Form>
			<Form form={fieldOptionForm} layout="vertical">
				{renderOptions(fieldType)}
			</Form>
			<div className="flex gap-3">
				<Button onClick={resetField}>Reset Field</Button>
				<Button type="primary" htmlType="button" onClick={() => form.submit()} className="bg-primary text-slate-50">
					Add Field
				</Button>
			</div>
		</div>
	);
}
