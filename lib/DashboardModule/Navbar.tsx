import React, { PropsWithChildren, ReactNode, memo } from 'react';

interface NavbarProps extends PropsWithChildren {
	startComponent?: ReactNode;
	endComponent?: ReactNode;
}

const Navbar = ({ startComponent, endComponent }: NavbarProps) => {
	return (
		<div className="px-3 py-2 bg-white flex item-center justify-between">
			{startComponent}
			{endComponent}
		</div>
	);
};

export default memo(Navbar);
