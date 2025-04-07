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
    <section id="contact" className="relative px-6 py-16 lg:py-24 text-center rounded-md overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-18 h-18 bg-blue-300 rounded-full opacity-20 blur-lg"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-300 rounded-full opacity-30 blur-xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center">
        {/* Section Heading */}
        <h2 className="font-bold text-3xl lg:text-4xl tracking-tight text-gray-900 dark:text-white">
          Let&apos;s Connect
        </h2>

        {/* Contact Icons */}
        <div className="flex gap-5 mt-8">
          {contactPoints.map(({ icon, alt, href }) => (
            <motion.div key={href} whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
              <a
                target="_blank"
                href={href}
                className="p-4 w-16 h-16 rounded-md flex items-center justify-center bg-white dark:bg-gray-800 shadow-lg transition hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={alt}>
                <Image src={icon} width={32} height={32} alt={alt} className="brightness-0 dark:invert" />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-gray-600 dark:text-gray-400 text-sm">
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
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
