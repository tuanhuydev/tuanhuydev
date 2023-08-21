import React, { memo } from 'react';

function Footer() {
	const currentYear = new Date().getFullYear();
	return (
		<footer
			id="footer"
			className="flex flex-col items-center md:flex-row text-center md:text-left justify-between py-3 px-2 font-medium text-primary dark:text-slate-50">
			<div className="text-md">
				&copy;&nbsp;{currentYear}&nbsp;
				<span>Huy Nguyen Tuan</span>
			</div>
			<div className="text-sm">&#128296; with &#128149; and &#x1F375;</div>
		</footer>
	);
}
export default memo(Footer);
