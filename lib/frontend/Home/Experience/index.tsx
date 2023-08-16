import { MOCK_PROJECTS } from 'lib/shared/configs/constants';
import { ObjectType } from 'lib/shared/interfaces/base';
import Image from 'next/image';
import React, { memo, useMemo } from 'react';

import styles from './styles.module.scss';

export default memo(function Experience() {
	const Projects = useMemo(
		() =>
			MOCK_PROJECTS.map((project: ObjectType) => (
				<div
					className={`${styles.card} dark:shadow-none shadow-200 items-center relative p-3 h-96 w-full md:w-80 max-w-full border-2 border-transparent dark:border-slate-700 dark:text-white rounded-xl`}
					key={project.title}>
					<div className="flex min-w-0">
						<div
							className={`${styles.image} drop-shadow-md dark:drop-shadow-none shrink-0 relative flex items-center justify-center rounded-xl bg-slate-100`}>
							{project?.image && <Image src={project.image} width={96} height={96} alt={project.title} />}
						</div>
					</div>
					<div className="relative">
						<div className={`${styles.title} flex items-center justify-between relative`}>
							<h3 className="text-3xl font-bold mb-3 truncate z-10">{project.title}</h3>
							<h5 className={`${styles.time} font-medium text-sm`}>{project.time}</h5>
						</div>
						<ul className={`${styles.stack} flex flex-wrap`}>
							{project?.technicals?.length &&
								project.technicals.map((technical: string) => (
									<li className="flex font-medium text-sm mr-1" key={technical}>
										#{technical}
									</li>
								))}
						</ul>
						<p className={`${styles.description} absolute truncate-paragraph mt-5 text-slate-400`}>
							{project.description}
						</p>
					</div>
				</div>
			)),
		[]
	);

	return (
		<section id="experience" className="py-10 md:py-24 px-2">
			<h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 tracking-tight dark:text-white pt-14 pb-7">
				&#60;Experience&#47;&#62;
			</h1>
			<div className="cards p-3 flex gap-8 overflow-x-auto overflow-y-hidden">{Projects}</div>
		</section>
	);
});
