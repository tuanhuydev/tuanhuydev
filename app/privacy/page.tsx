import { Navbar } from "@features/Landing/components/Navbar";
import { Footer } from "@resources/landing/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms of Service | tuanhuydev",
  description: "Learn how tuanhuydev.com collects, uses, and protects your information. Read our terms and conditions.",
};

export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <Navbar />
      <div className="w-full grow lg:w-4/5 lg:w-4xl mx-auto pt-32 flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Legal Information</h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mb-4">
            Your privacy and trust matter to us. Learn how we protect your data and what to expect when using our
            services.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <a
              href="#privacy"
              className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition text-sm md:text-base">
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition text-sm md:text-base">
              Terms of Service
            </a>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Last updated:</strong> December 8, 2025
          </p>
        </div>

        {/* Privacy Policy Section */}
        <section id="privacy" className="scroll-mt-32">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h2>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <p className="text-gray-700 dark:text-gray-300">
                Welcome to <strong>tuanhuydev.com</strong>. This Privacy Policy explains how we collect, use, and
                protect your information when you use our services.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">We collect information you provide when you:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Register for an account (name, email, password)</li>
                <li>Create content (projects, tasks, blog posts, comments)</li>
                <li>Upload files to AWS S3</li>
                <li>Contact us via email</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4 mb-3">We also automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>IP address, browser type, and device information</li>
                <li>Usage data via Google Analytics and Vercel Analytics</li>
                <li>Cookies for authentication and preferences</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2. How We Use Your Information
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Provide and maintain our services</li>
                <li>Authenticate users and manage accounts</li>
                <li>Improve user experience and analyze usage patterns</li>
                <li>Send administrative updates and security alerts</li>
                <li>Protect against fraud and unauthorized access</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Data Storage and Security</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">Your data is stored in:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>MongoDB:</strong> User accounts, projects, tasks, posts
                </li>
                <li>
                  <strong>AWS S3:</strong> File uploads and media
                </li>
                <li>
                  <strong>Vercel:</strong> Application hosting
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4 mb-3">Security measures include:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Bcrypt password encryption</li>
                <li>HTTP-only cookies with SameSite policy</li>
                <li>HTTPS encryption</li>
                <li>Role-based access control</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Third-Party Services</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">We use these third-party services:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Google Analytics & Google Tag Manager</li>
                <li>Vercel Analytics & Speed Insights</li>
                <li>AWS S3</li>
                <li>Google Generative AI (for AI features)</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Your Rights</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Object to data processing</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Contact us at{" "}
                <a href="mailto:tuanhuydev@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  tuanhuydev@gmail.com
                </a>{" "}
                to exercise these rights.
              </p>
            </div>
          </div>
        </section>

        {/* Terms of Service Section */}
        <section id="terms" className="scroll-mt-32">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h2>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <p className="text-gray-700 dark:text-gray-300">
                By using <strong>tuanhuydev.com</strong>, you agree to these Terms of Service. If you do not agree,
                please do not use our services.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Services Provided</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">We provide:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Blog platform for technical articles</li>
                <li>Project management tools</li>
                <li>Task management and sprint tracking</li>
                <li>User dashboard and file storage</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. User Accounts</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">You must:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Be at least 13 years old</li>
                <li>Provide accurate registration information</li>
                <li>Keep your password secure</li>
                <li>Notify us of unauthorized account access</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                We may terminate accounts that violate these terms.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. User Content</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>You own all content you create</li>
                <li>You grant us license to host and display your content</li>
                <li>You are responsible for your content</li>
                <li>We may remove content that violates our policies</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Prohibited Conduct</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">You may not:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Post illegal, harmful, or offensive content</li>
                <li>Infringe intellectual property rights</li>
                <li>Upload malware or viruses</li>
                <li>Attempt unauthorized access to systems</li>
                <li>Use automated scraping tools</li>
                <li>Spam or harass other users</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Disclaimers</h3>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                The service is provided &quot;as is&quot; without warranties. We do not guarantee uninterrupted,
                error-free service.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h3>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                We are not liable for indirect, incidental, or consequential damages including data loss, revenue loss,
                or service interruption.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Governing Law</h3>
              <p className="text-gray-700 dark:text-gray-300">These terms are governed by the laws of Vietnam.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact Us</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Questions about our Privacy Policy or Terms of Service?
          </p>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:tuanhuydev@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                tuanhuydev@gmail.com
              </a>
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a href="https://tuanhuydev.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                tuanhuydev.com
              </a>
            </p>
          </div>
        </section>

        {/* Acknowledgment Box */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-blue-50 dark:bg-slate-800/50">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            By using tuanhuydev.com, you acknowledge that you have read and agree to our Privacy Policy and Terms of
            Service.
          </p>
        </div>

        <Footer />
      </div>
    </main>
  );
}
