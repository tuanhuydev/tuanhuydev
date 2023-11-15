import dynamic from 'next/dynamic';
import React, { Fragment, PropsWithChildren } from 'react';

const Navbar = dynamic(() => import('./Navbar'), { ssr: false });
const WithAnimation = dynamic(() => import('@lib/components/hocs/WithAnimation'), { ssr: false });

export interface PageContainerProps extends PropsWithChildren {
	title?: string;
	goBack?: boolean;
}

export default function PageContainer({ children, title, goBack }: PageContainerProps) {
	return (
		<Fragment>
			<Navbar title={title} goBack={goBack} />
			<div className="h-full overflow-auto p-3 bg-white drop-shadow-lg">
				<WithAnimation>{children}</WithAnimation>
			</div>
		</Fragment>
	);
}
