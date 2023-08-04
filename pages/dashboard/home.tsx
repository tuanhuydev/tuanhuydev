import { NextPageWithLayout } from '@pages/_app';
import { ReactNode } from 'react';

import PageContainer from '@frontend/Dashboard/PageContainer';
import WithAuth from '@frontend/components/hocs/WithAuth';

const Dashboard = () => {
	return <h1>Home</h1>;
};

const Page = WithAuth(Dashboard);
export default Page;

(Page as NextPageWithLayout).getLayout = function getLayout(page: ReactNode) {
	return (
		<PageContainer title="Home" data-testid="dashboard-home-page-testid">
			{page}
		</PageContainer>
	);
};
