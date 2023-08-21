import Contact from 'lib/frontend/Home/Contact';
import Experience from 'lib/frontend/Home/Experience';
import Hero from 'lib/frontend/Home/Hero';
import WithProvider from 'lib/frontend/components/hocs/WithProvider';
import BaseLayout from 'lib/frontend/components/layouts/BaseLayout';
import type { NextPage } from 'next';
import React, { Fragment } from 'react';

export const metadata = {
	title: 'tuanhuydev',
	description: 'Huy Nguyen Tuan personal website',
};

const Home: NextPage = () => {
	return (
		<Fragment>
			<WithProvider>
				<div data-testid="homepage-testid">
					<BaseLayout>
						<Hero />
						<Experience />
						<Contact />
					</BaseLayout>
				</div>
			</WithProvider>
			<audio id="audio" src="/assets/sounds/click.wav">
				Your browser does not support the
				<code>audio</code> element.
			</audio>
		</Fragment>
	);
};

export default React.memo(Home);
