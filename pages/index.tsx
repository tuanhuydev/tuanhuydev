import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Contact from '@frontend/components/home/Contact';
import Experience from '@frontend/components/home/Experience';
import Hero from '@frontend/components/home/Hero';
import BaseLayout from '@frontend/components/layouts/BaseLayout';

const Home: NextPage = () => {
	return (
		<div data-testid="homepage-testid">
			<Head>
				<title>tuanhuydev</title>
				<meta name="description" content="Huy Nguyen Tuan personal website" />
			</Head>
			<BaseLayout>
				<Hero />
				<Experience />
				<Contact />
				<audio id="audio" src="/assets/sounds/click.wav">
					Your browser does not support the
					<code>audio</code> element.
				</audio>
			</BaseLayout>
		</div>
	);
};

export default React.memo(Home, () => false);
