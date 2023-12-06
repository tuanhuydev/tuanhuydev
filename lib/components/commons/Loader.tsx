'use client'
import dynamic from 'next/dynamic';
import React, { memo } from 'react';

const LoadingOutlined = dynamic(async () => (await import('@ant-design/icons')).LoadingOutlined, { ssr: false });
const Spin = dynamic(async () => (await import('antd/es/spin')).default, { ssr: false });

export default memo(function Loader() {
	const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;
	return (
		<div className="w-full h-full flex items-center justify-center">
			<Spin indicator={antIcon} />
		</div>
	);
});
