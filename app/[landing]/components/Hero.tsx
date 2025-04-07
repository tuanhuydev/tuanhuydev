import { Pattern } from "./Pattern";

export const Hero = () => {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0">
        <Pattern />
      </div>
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to tuanhuydev</h1>
        <p className="text-xl text-gray-600 mt-2">Full-Stack Developer & Technology Enthusiast</p>
      </header>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-700 mb-4">
          Hi there! I&apos;m a passionate developer with expertise in React, TypeScript, and modern web technologies.
          With over 5 years of experience building robust web applications, I focus on creating elegant solutions to
          complex problems.
        </p>
        <p className="text-gray-700">
          When I&apos;m not coding, you can find me exploring new tech, contributing to open-source, or hiking in the
          mountains.
        </p>
      </section>
    </div>
  );
};
