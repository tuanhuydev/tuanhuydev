'use client';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
// if you are using Next.js 14, use below import instead. More info: https://github.com/ant-design/ant-design/issues/45567
// import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs/lib';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from 'next/navigation';
import React from 'react';

const StyledComponentsRegistry = ({ children }: React.PropsWithChildren) => {
	const cache = React.useMemo<Entity>(() => createCache(), []);
	useServerInsertedHTML(() => <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />);
	return (
		<StyleProvider cache={cache} hashPriority="high">
			{children}
		</StyleProvider>
	);
};

export default StyledComponentsRegistry;
