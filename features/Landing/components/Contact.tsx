import Image from "next/image";

const contactPoints = [
  {
    icon: "/assets/images/socials/email.svg",
    alt: "Send me an email",
    href: "mailto:tuanhuydev@gmail.com",
  },
  {
    icon: "/assets/images/socials/github.svg",
    alt: "Check out my GitHub",
    href: "https://github.com/tuanhuydev",
  },
  {
    icon: "/assets/images/socials/linkedin.svg",
    alt: "Connect on LinkedIn",
    href: "https://www.linkedin.com/in/tuanhuydev",
  },
];

export default async function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 py-16 lg:py-24 text-center rounded-md overflow-hidden contain-layout">
      <div className="flex flex-col items-center animate-fadeIn gap-6">
        {/* Section Heading */}
        <h2 className="font-bold text-3xl lg:text-4xl tracking-tight text-gray-900 dark:text-white">
          Let&apos;s Connect
        </h2>

        {/* Contact Icons */}
        <div className="flex gap-3 sm:gap-5 contain-style">
          {contactPoints.map(({ icon, alt, href }) => (
            <div key={href}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={href}
                className="p-4 w-12 h-12 lg:w-16 lg:h-16 rounded-md flex items-center justify-center 
                    bg-white/80 dark:bg-gray-800/80
                    transition-all duration-200 ease-out
                    hover:bg-gray-100/90 dark:hover:bg-gray-700/90
                    hover:scale-110
                    hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label={alt}>
                <Image
                  src={icon}
                  width={32}
                  height={32}
                  alt={alt}
                  className="brightness-0 dark:invert transition-transform duration-200 group-hover:scale-110"
                />
              </a>
            </div>
          ))}
        </div>

        <div className="flex basis-16 items-center justify-center gap-3 sm:gap-5 text-sm animate-fadeIn">
          {[
            { emoji: "🚀", text: "Code" },
            { emoji: "💡", text: "Design" },
            { emoji: "🔧", text: "Build" },
          ].map((item) => (
            <div key={item.text} className="flex flex-shrink-0 items-center gap-2">
              <span>{item.emoji}</span>
              <span className="text-gray-600 dark:text-gray-400">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
