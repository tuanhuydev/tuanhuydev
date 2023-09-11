import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { memo } from 'react';

export default memo(function Loader() {
	const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Spin indicator={antIcon} />
		</div>
	);
});
