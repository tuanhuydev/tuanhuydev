import { Footer } from "@app/[landing]/components/Footer";

export const metadata = {
  title: "Privacy Policy - tuanhuy.dev",
  description: "Learn how tuanhuy.dev collects and protects your personal information.",
};

export default async function Privacy() {
  return (
    <main className=" bg-slate-50 dark:bg-slate-900 font-sans relative" data-testid="homepage-testid">
      <div className="container mx-auto">
        <div className="relative text-base text-primary dark:text-slate-50">
          <h1 className="m-0 py-4">Privacy Policy</h1>
          <p>Last updated: 2024/04/09</p>
          <p>
            Welcome to tuanhuy.dev (referred to as &quot;us&quot;, &quot;we&quot;, or &quot;our&quot;). Protecting your
            privacy is important to us. This Privacy Policy outlines how we collect, use, and safeguard your personal
            information when you visit our website and interact with our services. By using our website, you agree to
            the terms outlined in this policy.
          </p>

          <h2>Information Collection And Use</h2>
          <p>
            While using our Service, we may collect certain personally identifiable information to enhance your
            experience and provide you with our services. However, we do not require any form submission from the user.
            The information we may collect includes:
          </p>
          <ul>
            <li>
              <strong>Log Data:</strong> When you visit our website, we may automatically receive and record information
              from your browser, such as your computer&apos;s Internet Protocol (&quot;IP&quot;) address, browser type,
              browser version, the pages of our Service that you visit, the time and date of your visit, the time spent
              on those pages, and other statistics. This information helps us analyze trends, administer the site, track
              users&apos; movements around the site, and gather demographic information.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies, which are small pieces of data stored on your device, to improve
              your browsing experience and customize our services. You can choose to accept or decline cookies through
              your browser settings. Please note that rejecting cookies may limit the functionality of our website.
            </li>
          </ul>

          <h2>Service Providers</h2>
          <p>
            We may engage third-party companies and individuals to assist us in providing and improving our services,
            analyze how our Service is used, and perform other service-related tasks. These third parties have access to
            your personal information only to perform these tasks on our behalf and are obligated not to disclose or use
            it for any other purpose.
          </p>

          <h2>Security</h2>
          <p>
            We are committed to protecting the security of your personal information. However, please be aware that no
            method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to
            use commercially acceptable means to protect your personal information, we cannot guarantee its absolute
            security.
          </p>

          <h2>Changes To This Privacy Policy</h2>
          <p>
            We reserve the right to update or modify this Privacy Policy at any time. Any changes will be effective
            immediately upon posting the updated Privacy Policy on this page. We encourage you to review this Privacy
            Policy periodically to stay informed about how we are protecting your information.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at &nbsp;
            <a href="mailto:tuanhuydev@gmail.com">tuanhuydev@gmail.com</a>.
          </p>

          <p>
            Thank you for trusting us with your personal information. Your privacy is important to us, and we are
            committed to safeguarding it.
          </p>
        </div>
        <Footer />
      </div>
    </main>
  );
}
