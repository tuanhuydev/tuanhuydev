import PageContainer from '@frontend/Dashboard/PageContainer';
import WithAuth from '@frontend/components/hocs/WithAuth';

const Dashboard = () => {
	return <PageContainer title="Home" />;
};

export default WithAuth(Dashboard);
