import { Navbar } from "@features/Landing/components/Navbar";
import { Footer } from "@resources/landing/components/Footer";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Support Me | tuanhuydev",
  description: "Support my open-source and content work via donation or sponsorship.",
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <Navbar />
      <div className="w-full grow lg:w-4/5 lg:w-4xl mx-auto pt-32 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Me</h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl">
          If you find my work helpful, consider supporting me. Your contributions help me maintain open-source projects,
          write tutorials, and create more content.
        </p>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://www.buymeacoffee.com/tuanhuydev"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition bg-white dark:bg-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Buy Me a Coffee</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">A quick way to say thanks ☕️</p>
          </a>

          <a
            href="https://github.com/sponsors/tuanhuydev"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition bg-white dark:bg-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">GitHub Sponsors</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Sponsor monthly to support ongoing work</p>
          </a>

          <a
            href="https://paypal.me/tuanhuydev"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition bg-white dark:bg-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">PayPal</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">One-time support via PayPal</p>
          </a>
        </section>

        <section className="max-w-2xl">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Vietnamese only</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-3">Quét mã VietQR để ủng hộ qua ngân hàng nội địa.</p>
          <Image
            src="/assets/images/support.jpeg"
            alt="VietQR — ngân hàng Việt Nam"
            width={224}
            height={224}
            className="object-contain"
          />
        </section>

        <Footer />
      </div>
    </main>
  );
}
