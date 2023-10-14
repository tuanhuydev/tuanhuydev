import { Tabs } from 'antd';
import React from 'react';

const App: React.FC = () => (
	<Tabs
		defaultActiveKey="1"
		items={[
			{
				label: 'Tab 1',
				key: '1',
				children: 'Tab 1',
			},
			{
				label: 'Tab 2',
				key: '2',
				children: 'Tab 2',
				disabled: true,
			},
		]}
	/>
);

export default App;
