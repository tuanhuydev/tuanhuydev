import WithAnimation from '@lib/components/hocs/WithAnimation';
import React, { Fragment, PropsWithChildren } from 'react';

import Navbar from './Navbar';

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
