"use client";

import EmailIcon from "@app/_assets/images/socials/email.svg";
import GithubIcon from "@app/_assets/images/socials/github.svg";
import LinkedInIcon from "@app/_assets/images/socials/linkedin.svg";
import { motion } from "framer-motion";
import Image from "next/image";

const contactPoints = [
  {
    icon: EmailIcon,
    alt: "Send me an email",
    href: "mailto:tuanhuydev@gmail.com",
  },
  {
    icon: GithubIcon,
    alt: "Check out my GitHub",
    href: "https://github.com/tuanhuydev",
  },
  {
    icon: LinkedInIcon,
    alt: "Connect on LinkedIn",
    href: "https://www.linkedin.com/in/tuanhuydev",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 py-16 lg:py-24 text-center rounded-md overflow-hidden contain-layout">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center will-change-auto">
        {/* Section Heading */}
        <h2 className="font-bold text-3xl lg:text-4xl tracking-tight text-gray-900 dark:text-white">
          Let&apos;s Connect
        </h2>

        {/* Contact Icons */}
        <div className="flex gap-5 mt-8 contain-style">
          {contactPoints.map(({ icon, alt, href }) => (
            <motion.div
              key={href}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="will-change-transform">
              <a
                target="_blank"
                href={href}
                className="p-4 w-12 h-12 lg:w-16 lg:h-16 rounded-md flex items-center justify-center 
                          bg-white/80 dark:bg-gray-800/80
                          transition-colors duration-200 ease-out
                          hover:bg-gray-100/90 dark:hover:bg-gray-700/90
                          focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label={alt}>
                <Image
                  src={icon}
                  width={32}
                  height={32}
                  alt={alt}
                  className="brightness-0 dark:invert transition-transform duration-200"
                />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-3 sm:gap-5 text-sm will-change-auto landing-contact-text">
          {[
            { emoji: "🚀", text: "Code" },
            { emoji: "💡", text: "Design" },
            { emoji: "🔧", text: "Build" },
          ].map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="flex flex-shrink-0 items-center gap-2">
              <span>{item.emoji}</span>
              <span className="text-gray-600 dark:text-gray-400">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
