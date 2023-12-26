import styles from "./styles.module.scss";
import EmailIcon from "@public/assets/images/email.svg";
import GithubIcon from "@public/assets/images/socials/github.svg";
import LinkedInIcon from "@public/assets/images/socials/linkedin.svg";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

const contactPoints = [
  { img: EmailIcon, alt: "tuanhuydev - send email", href: "mailto: tuanhuydev@gmail.com" },
  { img: GithubIcon, alt: "tuanhuydev - github profile", href: "https://github.com/tuanhuydev" },
  { img: LinkedInIcon, alt: "tuanhuydev - linkedin profile", href: "https://www.linkedin.com/in/tuanhuydev" },
];

export default function Contact() {
  const Contacts = useMemo(() => {
    return contactPoints.map(({ img, alt, href }) => (
      <Link href={href} legacyBehavior key={href} prefetch={false}>
        <a
          target="_blank"
          className="p-3 rounded-md flex items-center justify-center bg-white drop-shadow-md dark:drop-shadow-none hover:bg-slate-100 transition ease-in-out">
          <Image src={img} width={24} height={24} alt={alt} />
        </a>
      </Link>
    ));
  }, []);
  return (
    <section id="contact" data-testid="homepage-contact-testid" className="dark:text-white px-2 rounded-md py-24">
      <div className="grid grid-cols-12 gap-y-8 justify-items-center lg:justify-items-start">
        <div className="col-start-1 col-span-full lg:col-span-6">
          <h3 className={`${styles.texture} text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold ml-4`}>
            <span className="text-slate-600 dark:text-slate-300">I&lsquo;m the</span> <br />
            <span className="text-slate-900 dark:text-slate-100 break-keep">&#60;RightOne&#47;&#62;</span>
          </h3>
        </div>
        <div className="col-start-1 col-span-full lg:col-start-7">
          <ul role="list" className={styles.points}>
            <li className="text-sm lg:text-lg font-medium" data-icon="&#9757;">
              New features implementation
            </li>
            <li className="text-sm lg:text-lg font-medium" data-icon="&#128161;">
              Kick-off new projects
            </li>
            <li className="text-sm lg:text-lg font-medium" data-icon="&#x1F4C8;">
              Maintainer for your system
            </li>
          </ul>
          <div className="flex flex-col lg:flex-row">
            <h6 className="font-semibold my-5 text-xl text-center lg:text-left lg:text-3xl lg:mr-3">
              Let connect and discuss
            </h6>
            <div className="flex gap-3 self-center">{Contacts}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
