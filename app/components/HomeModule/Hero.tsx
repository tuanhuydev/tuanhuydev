import Image from "next/image";
import React from "react";

const matrixTypoStyles = "font-medium text-slate-700 dark:text-white text-[8px] sm:text-base";
const graphicStyles = `${matrixTypoStyles} drop-shadow-md m-auto rounded-md bg-slate-100 dark:bg-slate-700 p-2 transition duration-150 ease-out hover:ease-in `;

export default async function Hero() {
  return (
    <section id="about-me" className="grid grid-cols-12 gap-y-8 lg:gap-0 py-0 px-2 md:py-4 content-center">
      <div className="col-start-1 col-span-full order-2 text-center lg:text-left lg:col-span-5 lg:row-start-1 self-center">
        <div className="font-bold mb-3 dark:text-white">
          <div className="break-keep text-3xl md:text-4xl lg:text-5xl xl:text-7xl xl:mb-3 bg-gradient-to-r bg-clip-text text-transparent from-teal-600 via-blue-900 to-primary dark:from-teal-400 dark:to-blue-600">
            &#60;Developer&#47;&#62;
          </div>
          <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">to solve problem.</div>
        </div>
        <div className="relative mb-6">
          <h1 className="font-medium text-lg md:text-2xl mr-2 inline dark:text-white">
            I&lsquo;m Huy (tuanhuydev), a software engineer <br /> from Viet Nam
            <Image
              width={28}
              height={20}
              className="inline-flex mx-2 leading-7"
              src="/assets/images/vietnam_flag.png"
              alt="Viet Nam Flag"
            />
          </h1>
        </div>
        <div className="dark:text-white text-xs md:text-base mb-10">
          <div className="mb-1 text-slate-700 dark:text-slate-400">
            I&lsquo;m 5 years of&nbsp; #experience in&nbsp; #web development &nbsp;with&nbsp; #passion&nbsp;
            #professionalism&nbsp; #empathy&nbsp;
          </div>
          <div className="text-slate-700 dark:text-slate-400">
            I had great <strong>opportunities</strong> to work on amazing projects, teams, cultures. Contribute values
            to businesses&lsquo;s success, including&nbsp;
            <strong>yours</strong>.😀&#128077;
          </div>
        </div>
        <a href="#service">
          <h3 className="inline-flex items-center rounded-full bg-gradient-to-r from-teal-600 via-blue-900 to-primary dark:from-teal-400 dark:to-blue-600 text-slate-50 dark:text-primary fill-slate-50 dark:fill-primary hover:scale-105 px-4 py-2 mr-3 cursor-pointer uppercase text-[8px] md:text-sm font-semibold transition duration-200 ease-in group">
            My proudly accomplishments
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              viewBox="0 96 960 960"
              width="16"
              className="ml-2 transition-transform duration-200 group-hover:rotate-90">
              <path d="m480 902.218-56.131-57.131 230.042-229.478H153.782v-79.218h500.129L423.869 306.348 480 249.782 806.218 576 480 902.218Z" />
            </svg>
          </h3>
        </a>
      </div>
      <div className="col-start-1 col-span-full lg:col-start-7 relative overflow-x-hidden h-max sm:overflow-visible">
        <ul className="grid grid-cols-12 gap-1 md:gap-4 lg:gap-6 xl:gap-7 grid-rows-6 list-none m-0 p-0">
          <li className={`${graphicStyles} col-start-1 col-span-4`}>#Web Development</li>
          <li className={`${graphicStyles} col-start-3 row-start-3`}>#NextJS</li>
          <li className={`${graphicStyles} col-start-2 opacity-80 row-start-4`}>#CSS</li>
          <li className={`${graphicStyles} col-start-6 row-start-2`}>#Javascript</li>
          <li className={`${graphicStyles} col-start-6 opacity-80`}>#HTML</li>
          <li className={`${graphicStyles} col-start-11 row-start-4`}>#Angular</li>
          <li className={`${graphicStyles} col-start-9 row-start-3`}>#Typescript</li>
          <li className={`${graphicStyles} col-start-2 opacity-80 row-start-2`}>#Git</li>
          <li className={`${graphicStyles} col-start-6 opacity-80 row-start-6`}>#Docker</li>
          <li className={`${graphicStyles} col-start-10 opacity-80 col-span-full row-start-2`}>#PHP Laravel</li>
          <li className="col-start-5 col-span-4 row-start-3 row-span-2 m-2 p-2 relative flex justify-center items-center">
            <Image
              src="/assets/images/avatar.png"
              width={200}
              height={200}
              alt="avatar"
              className="rounded-full w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48"
              priority
            />
          </li>
          <li className={`${graphicStyles} col-start-7 col-span-2 row-start-5`}>#ReactJS</li>
          <li className={`${graphicStyles} col-start-10 opacity-80 col-span-2 row-start-5`}>#CI/CD</li>
          <li className={`${graphicStyles} col-start-11 opacity-80 row-start-6`}>#AWS</li>
          <li className={`${graphicStyles} col-start-3 opacity-80 col-span-2 row-start-5`}>#English</li>
          <li className={`${graphicStyles} col-start-1 col-span-3`}>#Work Hard</li>
          <li className={`${graphicStyles} col-start-9 col-span-3 row-start-1`}>#Communication</li>
        </ul>
      </div>
    </section>
  );
}
