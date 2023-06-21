import PageContainer from '@frontend/Dashboard/PageContainer';
import WithAuth from '@frontend/components/hocs/WithAuth';

const Posts = () => {
	return <PageContainer title="Posts">Posts</PageContainer>;
};

export default WithAuth(Posts);
