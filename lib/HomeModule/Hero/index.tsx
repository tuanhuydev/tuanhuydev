import Avatar from '@public/assets/images/avatar.png';
import FlagIcon from '@public/assets/images/vietnam_flag.png';
import Image from 'next/image';
import React from 'react';

const matrixTypoStyles = 'font-medium text-slate-700 dark:text-white text-xs sm:text-base';
const graphicStyles = `${matrixTypoStyles} drop-shadow-md m-auto rounded-md bg-slate-100 dark:bg-slate-700 p-2 transition duration-150 ease-out hover:ease-in `;

export default function Hero() {
	return (
		<section
			id="about-me"
			data-testid="homepage-about-me"
			className="grid grid-cols-12 gap-y-8 lg:gap-0 py-0 md:py-24 content-center">
			<div className="col-start-1 col-span-full order-2 text-center lg:text-left lg:col-span-5 lg:row-start-1 self-center">
				<h2 className="font-bold mb-3 dark:text-white">
					<span className="break-keep text-3xl md:text-4xl lg:text-5xl xl:text-7xl">&#60;Developer&#47;&#62;</span>{' '}
					<br />
					<span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">to solve problem</span>
				</h2>
				<div className="relative mb-6">
					<h2 className="font-medium text-lg md:text-2xl mr-2 inline dark:text-white">
						I&lsquo;m Huy, a software engineer <br /> from Viet Nam
						<Image
							width={28}
							height={18}
							style={{ display: 'inline', marginLeft: '0.5rem' }}
							src={FlagIcon}
							alt="Viet Nam Flag"
						/>
					</h2>
				</div>
				<div className="dark:text-white text-xs md:text-base mb-10">
					I&lsquo;m 4 years of&nbsp;
					<h3 className="inline-flex font-medium">#experience</h3> in&nbsp;
					<h3 className="inline-flex font-medium">#web development</h3>
					&nbsp;with&nbsp;
					<br />
					<h3 className="inline-flex font-medium">#passion</h3>&nbsp;
					<h3 className="inline-flex font-medium">#professionalism</h3>&nbsp;
					<h3 className="inline-flex font-medium">#empathy</h3>&nbsp;
					<br />I had great <strong>opportunities</strong> to work on amazing projects, teams, cultures.
					<br />
					Contribute values to businesses&lsquo;s success, including&nbsp;
					<strong>yours</strong>.😀&#128077;
					<br />
				</div>
				<a href="#service">
					<h6
						className={`drop-shadow-md inline-flex items-center self-start rounded-full bg-slate-800 hover:bg-slate-900 text-white fill-white dark:bg-white dark:text-primary dark:fill-primary px-4 py-2 mr-3 cursor-pointer uppercase text-xs md:text-sm font-semibold transition ease-in`}>
						My proudly accomplishments
						<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 96 960 960" width="16" className="ml-2">
							<path d="m480 902.218-56.131-57.131 230.042-229.478H153.782v-79.218h500.129L423.869 306.348 480 249.782 806.218 576 480 902.218Z" />
						</svg>
					</h6>
				</a>
			</div>
			<div className="col-start-1 col-span-full lg:col-start-7 relative overflow-x-hidden h-max sm:overflow-visible">
				<ul className="grid grid-cols-12 gap-1 md:gap-4 lg:gap-6 xl:gap-7 grid-rows-6 list-none m-0 p-0">
					<li className={`${graphicStyles} col-start-1 col-span-4`}>#Web Development</li>
					<li className={`${graphicStyles} col-start-3 row-start-3`}>#HTML</li>
					<li className={`${graphicStyles} col-start-2 row-start-4`}>#CSS</li>
					<li className={`${graphicStyles} col-start-6 row-start-2`}>#Javascript</li>
					<li className={`${graphicStyles} col-start-6`}>#NextJS</li>
					<li className={`${graphicStyles} col-start-11 row-start-4`}>#Angular</li>
					<li className={`${graphicStyles} col-start-9 row-start-3`}>#Typescript</li>
					<li className={`${graphicStyles} col-start-2 row-start-2`}>#Git</li>
					<li className={`${graphicStyles} col-start-6 row-start-6`}>#ReactJS</li>
					<li className={`${graphicStyles} col-start-10 col-span-full row-start-2`}>#PHP Laravel</li>
					<li className="col-start-5 col-span-4 row-start-3 row-span-2 m-2 p-2 relative flex justify-center items-center">
						<Image
							src={Avatar}
							alt="avatar"
							className="rounded-full w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48"
							priority
						/>
					</li>
					<li className={`${graphicStyles} col-start-7 col-span-2 row-start-5`}>#Docker</li>
					<li className={`${graphicStyles} col-start-10 col-span-2 row-start-5`}>#CI/CD</li>
					<li className={`${graphicStyles} col-start-11 row-start-6`}>#AWS</li>
					<li className={`${graphicStyles} col-start-3 col-span-2 row-start-5`}>#English</li>
					<li className={`${graphicStyles} col-start-1 col-span-3`}>#Work Hard</li>
					<li className={`${graphicStyles} col-start-9 col-span-3 row-start-1`}>#Communication</li>
				</ul>
			</div>
		</section>
	);
};
