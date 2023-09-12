'use client';

import { CodeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type DelightProps = {
	title: string;
	value: number;
	delay?: number;
};

const Delight = ({ title, value: target, delay = 30 }: DelightProps) => {
	const [value, setValue] = useState(0);

	useEffect(() => {
		const countInterval = setInterval(() => {
			if (value < target) setValue(value + 1);
		}, delay);
		return () => clearInterval(countInterval);
	}, [delay, target, value]);

	return (
		<div className="text-center text-primary dark:text-slate-50 p-3 flex-1 self-stretch">
			<h2 className="text-sm md:text-xl mb-3 font-semibold capitalize">&#60;{title}&nbsp;&#47;&#62;</h2>
			<p className="text-2xl md:text-5xl font-bold">{value}+</p>
		</div>
	);
};

export default function Page() {
	return (
		<section id="service" className="py-10 md:py-24">
			<h2 className="text-center text-primary dark:text-slate-50 font-bold text-xl md:text-3xl lg:text-4xl mb-3">
				&ldquo;Elevating Excellence in Every Project &rdquo;
			</h2>
			<h5 className="text-slate-700 dark:text-slate-400 text-center mb-5">
				<span className="break-keep text-xs md:text-sm lg:text-base inline-block">
					I consistently deliver quality and innovation,&nbsp;
				</span>
				<span className="break-keep text-xs md:text-sm lg:text-base inline-block">
					setting new standards for success.
				</span>
			</h5>

			<div className="grid grid-cols-12 gap-5 p-3 grid-flow-row">
				<div className="col-start-2 col-span-10 md:col-start-4 md:col-span-6 flex justify-center">
					<Link href={'#contact'} legacyBehavior>
						<div className="w-56 h-56 md:w-96 md:h-96 flex flex-col justify-center items-center rounded-md transition-all bg-slate-50 text-primary dark:bg-slate-800 dark:text-slate-50 drop-shadow duration-150 hover:drop-shadow-xl hover:scale-105 ease-in-out cursor-pointer">
							<CodeOutlined className="text-5xl lg:text-[6rem]" />
							<h3 className="text-xl md:text-3xl font-semibold mt-5">Web Development</h3>
						</div>
					</Link>
				</div>
				<div className="col-start-2 col-span-10 md:col-start-4 md:col-span-6 flex flex-wrap sm:flex-nowrap justify-between">
					<Delight title="projects" value={10} />
					<Delight title="companies" value={3} />
					<Delight title="experiences" value={4} />
				</div>
			</div>
		</section>
	);
}
