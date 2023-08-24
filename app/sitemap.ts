import PostService from '@lib/backend/services/PostService';
import { BASE_URL, NODE_ENV } from '@lib/shared/configs/constants';
import { MetadataRoute } from 'next';

const getPosts = async () => {
	try {
		return PostService.getPosts();
	} catch (error) {
		if (NODE_ENV === 'production') console.log((error as Error).message);
		return [];
	}
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const sites = [
		{
			url: BASE_URL,
			lastModified: new Date(),
		},
	];

	const posts = await getPosts();

	posts.forEach(({ publishedAt, deletedAt, updatedAt, slug }) => {
		if (publishedAt && !deletedAt) {
			sites.push({
				url: `${BASE_URL}/posts/${slug}`,
				lastModified: new Date(updatedAt),
			});
		}
	});

	return sites;
}
