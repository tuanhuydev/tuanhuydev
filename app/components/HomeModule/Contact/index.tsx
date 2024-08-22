import styles from "./styles.module.scss";
import EmailIcon from "@public/assets/images/email.svg";
import GithubIcon from "@public/assets/images/socials/github.svg";
import LinkedInIcon from "@public/assets/images/socials/linkedin.svg";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const contactPoints = [
  { img: EmailIcon, alt: "tuanhuydev - send email", href: "mailto: tuanhuydev@gmail.com" },
  { img: GithubIcon, alt: "tuanhuydev - github profile", href: "https://github.com/tuanhuydev" },
  { img: LinkedInIcon, alt: "tuanhuydev - linkedin profile", href: "https://www.linkedin.com/in/tuanhuydev" },
];

export default async function Contact() {
  return (
    <section
      id="contact"
      data-testid="homepage-contact-testid"
      className="dark:text-white px-2 rounded-md py-8 md:py-10 lg:py-24">
      <div className="flex flex-col items-center">
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
        <div className="flex flex-col">
          <h5 className="font-semibold my-5 text-xl text-center lg:text-left lg:text-3xl lg:mr-3">
            Let connect and discuss
          </h5>
          <div className="flex gap-3 self-center">
            {contactPoints.map(({ img, alt, href }) => (
              <Link href={href} legacyBehavior key={href} prefetch={false}>
                <a
                  target="_blank"
                  className="p-3 rounded-md flex items-center justify-center bg-white drop-shadow-md dark:drop-shadow-none hover:bg-slate-100 transition ease-in-out">
                  <Image src={img} width={24} height={24} alt={alt} />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
