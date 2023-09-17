import { ObjectType } from '@lib/shared/interfaces/base';
import { Button, Empty, Form, Input, Radio, Select } from 'antd';
import React, { Fragment } from 'react';

export interface FieldStackProps {
	fields: Array<ObjectType>;
}

const { Option } = Select;

const renderFieldElement = (field: ObjectType) => {
	const { type, options, validate, ...restField } = field;
	if (!type) return <Fragment />;

	const makeElement = (() => {
		switch (type) {
			case 'TEXT':
				return <Input {...options} />;
			case 'RADIO':
				const { items: radioItems = [] } = restField;
				return (
					<Radio.Group>
						{radioItems.map(({ label, value }: any) => (
							<Radio key={label} value={value}>
								{label}
							</Radio>
						))}
					</Radio.Group>
				);
			case 'SELECT':
				const { items: selectItems = [], label } = restField;
				return (
					<Select {...options}>
						{selectItems.map(({ label, value }: any) => (
							<Option key={value} value={value}>
								{label}
							</Option>
						))}
					</Select>
				);
			default:
				return <Fragment />;
		}
	})();

	const rules = [];
	if (validate === 'required') {
		rules.push({ required: true });
	}

	return (
		<Form.Item key={field.name} {...restField} rules={rules}>
			{makeElement}
		</Form.Item>
	);
};

export default function Preview({ fields }: FieldStackProps) {
	return (
		<div className="grow flex-1 self-stretch min-w-[300px] border rounded p-3">
			<h2 className="text-xl font-semibold mb-4">Preview</h2>
			{(fields as Array<any>).length ? (
				<Form layout="vertical">
					{(fields as any[]).map((field: any) => renderFieldElement(field))}
					<Button htmlType="submit" className="bg-primary !text-slate-50">
						Trigger Validate
					</Button>
				</Form>
			) : (
				<Empty description="No Preview" />
			)}
		</div>
	);
}
