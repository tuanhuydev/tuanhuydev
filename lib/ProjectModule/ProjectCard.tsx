import { DATE_FORMAT } from '@lib/configs/constants';
import { ObjectType } from '@lib/shared/interfaces/base';
import { Project } from '@prisma/client';
import { Card } from 'antd';
import format from 'date-fns/format';
import { useRouter } from 'next/navigation';
import React from 'react';

export interface ProjectCard {
	project: Project;
}

export const Status = () => {
	return <div className="w-3 h-3 rounded-full border border-s-amber-500 bg-amber-500"></div>;
};
export default function ProjectCard({
	id,
	name,
	description,
	startDate,
	users,
}: Partial<Project & { users: Array<ObjectType> }>) {
	const router = useRouter();
	const navigateDetail = () => router.push(`/dashboard/projects/${id}`);

	return (
		<Card
			title={name}
			hoverable
			rootClassName="w-[18rem]"
			headStyle={{ fontSize: 20 }}
			className="cursor-pointer"
			extra={<Status />}
			onClick={navigateDetail}>
			<p className="mt-0 mb-3">{description}</p>
			<div className="grid grid-cols-[minmax(max-content,_1fr)_minmax(max-content,_1fr)] gap-2 justify-between relative text-xs">
				<div>
					<b>People:&nbsp;</b>
					{users?.length ?? 0}
				</div>
				<div>
					<b>Start Date:&nbsp;</b>
					{startDate ? format(new Date(startDate), DATE_FORMAT) : '-'}
				</div>
			</div>
		</Card>
	);
}
