import Image from "next/image";

export default async function Hero() {
  return (
    <section className="relative flex items-center justify-center rounded-md overflow-hidden min-h-[60dvh] lg:h-[80dvh] contain-layout contain-style">
      <div className="absolute inset-0 z-0 rounded-md will-change-contents">
        <Image src="/assets/images/bg.jpeg" fill className="object-cover" alt="Background Image" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">Hi, I&apos;m Huy</h1>
        <p className="text-lg md:text-3xl text-gray-300 mb-6">
          A software engineer based in &nbsp;
          <span className="whitespace-nowrap">
            Viet Nam &nbsp;
            <Image
              width={28}
              height={20}
              className="inline-flex align-middle"
              src="/assets/images/vietnam_flag.png"
              alt="Viet Nam Flag"
            />
          </span>
        </p>
        <p className="text-slate-300 text-sm md:text-base lg:text-lg mb-8">
          I create <strong>meaningful digital experiences</strong> with a focus on <strong>impact</strong>,{" "}
          <strong>quality</strong>, and <strong>efficiency</strong>. Driven by <strong>problem-solving</strong> and{" "}
          <strong>continuous improvement</strong>, I strive to build solutions that bring real value to people and
          businesses. 🚀
        </p>
        <a
          href="#experience"
          className="inline-block p-4 font-semibold rounded-full transition-transform duration-300 hover:scale-110 will-change-transform">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-slate-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{
              animation: "bounce 2s infinite",
            }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
