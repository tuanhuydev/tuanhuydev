import React, { memo } from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="container">
      <footer
        id="footer"
        className="flex flex-col relative items-center md:flex-row text-center md:text-left justify-between py-3 px-2 font-medium text-primary dark:text-slate-50">
        <div className="text-sm lg:text-md">
          &copy;&nbsp;{currentYear}&nbsp;
          <span>tuanhuydev</span>
        </div>
        <div className="text-sm">&#128296; with &#128149; and &#x1F375;</div>
      </footer>
    </div>
  );
}
export default memo(Footer);
