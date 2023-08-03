import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import PageContainer from '@frontend/Dashboard/PageContainer';
import PostForm from '@frontend/Posts/PostForm';

export default function Page() {
	return (
		<PageContainer title="Create new post">
			<PostForm />
		</PageContainer>
	);
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: { ...(await serverSideTranslations(locale ?? 'en', ['common'])) },
});
