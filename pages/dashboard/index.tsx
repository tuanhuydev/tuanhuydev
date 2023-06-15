import WithAuth from '@frontend/components/hocs/WithAuth';
import React from 'react';

const Dashboard = () => {
	return <h1>Dashboard</h1>;
};

export default WithAuth(Dashboard);
