export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      id="footer"
      className="flex flex-wrap items-center justify-center py-3 pt-24 text-sm text-center lg:text-md lg:justify-between">
      <div className="text-slate-900 dark:text-slate-300">
        &copy;&nbsp;{currentYear}&nbsp;
        <span>tuanhuydev</span>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/privacy" className="hover:underline text-slate-900 dark:text-slate-300">
          Privacy Policy
        </a>
      </div>
      <div className="text-slate-900 dark:text-slate-300">&#128296; with &#128149; and &#x1F375;</div>
    </footer>
  );
};
