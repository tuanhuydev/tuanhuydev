import bg from "@app/_assets/images/bg.jpeg";
import Image from "next/image";

export default async function Hero() {
  return (
    <section className="relative flex items-center justify-center rounded-md overflow-hidden min-h-[60dvh] lg:h-[80dvh]">
      <div className="absolute inset-0 z-0 rounded-md">
        <Image src={bg} fill className="object-cover" alt="Background Image" priority />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Hi, I&apos;m Huy</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 flex items-center justify-center">
          A software engineer based in Viet Nam &nbsp;
          <Image
            width={28}
            height={20}
            className="inline-flex mx-2"
            src="/assets/images/vietnam_flag.png"
            alt="Viet Nam Flag"
          />
        </p>
        <p className="text-slate-300 text-sm md:text-base mb-8">
          I create <strong>meaningful digital experiences</strong> with a focus on <strong>impact</strong>,{" "}
          <strong>quality</strong>, and <strong>efficiency</strong>. Driven by <strong>problem-solving</strong> and{" "}
          <strong>continuous improvement</strong>, I strive to build solutions that bring real value to people and
          businesses. 🚀
        </p>
        <a href="#experience" className="inline-block p-4  font-semibold rounded-full shadow-lg ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-slate-50 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
