import { MOCK_PROJECTS } from "@shared/configs/constants";
import { ObjectType } from "@shared/interfaces/base";
import Link from "next/link";
import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function Experience() {
  return (
    <section id="experience" className="py-10 md:py-24 px-2">
      <h1 className="font-mono text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 tracking-tight dark:text-white pt-14 pb-7">
        &#60;Experience &#47;&#62;
      </h1>
      <div className="cards flex flex-wrap gap-8">
        {MOCK_PROJECTS.map((project: ObjectType) => (
          <div
            className={`${styles.card} items-center relative p-3 h-96 w-full hover:w-full md:w-80 md:hover:w-96 max-w-full border-2 border-slate-200 dark:border-slate-700 dark:text-white rounded-md`}
            key={project.title}
          >
            <div className="flex min-w-0 justify-between">
              <div
                className={`${styles.image} mr-3 shrink-0 relative flex items-center justify-center rounded-xl bg-slate-50`}
              >
                {project?.image && (
                  <Image
                    src={project.image}
                    width={96}
                    height={96}
                    alt={project.title}
                  ></Image>
                )}
              </div>
              {project?.credential && (
                <span className="ml-auto self-start flex items-center cursor-pointer min-w-0 text-md">
                  &#128274;
                </span>
              )}
              {project?.url && (
                <Link href={project.url} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" className="block">
                    <div className="ml-auto self-start flex items-center cursor-pointer min-w-0">
                      <span className="truncate text-md font-medium">
                        &#128279;
                      </span>
                    </div>
                  </a>
                </Link>
              )}
            </div>
            <div className="relative">
              <div
                className={`${styles.title} flex items-center justify-between relative`}
              >
                <h3 className="text-3xl font-bold mb-3 truncate z-10">
                  {project.title}
                </h3>
                <h5 className={`${styles.time} font-medium text-sm`}>
                  {project.time}
                </h5>
              </div>
              <ul className={`${styles.stack} flex flex-wrap`}>
                {project?.technicals?.length &&
                  project.technicals.map((technical: string) => (
                    <li
                      className="flex font-medium text-sm mr-1"
                      key={technical}
                    >
                      #{technical}
                    </li>
                  ))}
              </ul>
              <p
                className={`${styles.description} absolute truncate-paragraph mt-5 text-slate-400`}
              >
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
