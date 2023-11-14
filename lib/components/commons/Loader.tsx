import { LoadingOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import React, { memo } from 'react';

const Spin = dynamic(() => import('antd/es/spin'), { ssr: false });

export default memo(function Loader() {
	const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;
	return (
		<div className="w-full h-full flex items-center justify-center">
			<Spin indicator={antIcon} />
		</div>
	);
});
