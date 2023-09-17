import { CloseCircleOutlined } from '@ant-design/icons';
import { ObjectType } from '@lib/shared/interfaces/base';
import { Collapse, CollapseProps, Empty } from 'antd';
import React, { Fragment } from 'react';

export interface FieldStackProps {
	fields: Array<ObjectType>;
	onRemove: (field: ObjectType) => void;
}

function FieldStack({ fields = [], onRemove }: FieldStackProps) {
	const removeField = (field: ObjectType) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation();
		onRemove(field);
	};

	const collapseItems: CollapseProps['items'] = (fields as ObjectType[]).map((field: ObjectType, key: number) => ({
		key,
		label: `[${field.type}] ${field.name}`,
		children: <pre>{JSON.stringify(field, null, 2)}</pre>,
		extra: <CloseCircleOutlined className="text-base cursor-pointer" onClick={removeField(field)} />,
		headerClass: 'font-semibold capitalize border !rounded-md mb-3',
	}));

	return (
		<div className="grow flex-1 self-stretch min-w-[300px] border rounded p-3">
			<h2 className="text-xl font-semibold mb-3">Field Stack</h2>
			{fields.length ? (
				<Collapse size="small" items={collapseItems} expandIconPosition="start" bordered ghost />
			) : (
				<Empty description="No Fields" />
			)}
		</div>
	);
}

export default React.memo(FieldStack);
