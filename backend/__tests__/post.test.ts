import { NextApiRequest, NextApiResponse } from 'next';

import PostController from '@backend/controllers/PostController';
import PostService from '@backend/services/PostService';
import { failResponse, successResponse } from '@backend/utils/http';

import { mockPost, mockPostId, mockPosts } from './mocks/posts';

describe('Post feature test suits', function () {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Get Posts API', () => {
		it('Should get post list', async () => {
			const req: NextApiRequest = { body: { title: 'this is a post' } } as any;
			const res: NextApiResponse = { json: jest.fn() } as any;
			await PostController.getAll(req, res);
			jest.spyOn(PostService, 'getPosts').mockResolvedValue(mockPosts);
			await PostController.getAll(req, res);

			expect(res.json).toHaveBeenCalledWith(successResponse(mockPosts));
		});

		it('Should get post by id', async () => {
			const mockId = 1;
			const mockPost = {
				id: mockId,
				title: 'this is first post',
				content: '<h1>Hello World</h1><p>This is a description</p>',
				published: false,
				authorId: '2e633db0-dc69-11ed-afa1-0242ac120002',
				deletedAt: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				slug: 'this-is-first-post-1687608784188',
			};

			const req: NextApiRequest = { query: { id: mockId } } as any;
			const res: NextApiResponse = { json: jest.fn() } as any;
			jest.spyOn(PostService, 'getPost').mockResolvedValue(mockPost);
			await PostController.getOne(req, res);
			expect(res.json).toHaveBeenCalledWith(successResponse(mockPost));
		});
	});

	describe('Create Post API', () => {
		it('Should throw error on missing field', async () => {
			const req: NextApiRequest = { body: { title: 'this is a post' } } as any;
			const res: NextApiResponse = { json: jest.fn() } as any;

			await PostController.store(req, res);
			expect(res.json).toHaveBeenCalledWith(failResponse('content is a required field'));
		});

		it('Should create with title and content', async () => {
			const req: NextApiRequest = { body: { title: 'this is a post', content: 'it content' } } as any;
			const res: NextApiResponse = { json: jest.fn() } as any;
			const createPostMock = jest.spyOn(PostService, 'createPost').mockResolvedValue({ id: 1, ...req.body });
			await PostController.store(req, res);
			expect(createPostMock).toHaveBeenCalledWith(req.body);
		});
	});

	describe('Update Post API', () => {
		it('Should update post with title and content by post id', async () => {
			const updateBody = { title: 'this is a post 1' };
			const req: NextApiRequest = { query: { id: mockPostId }, body: updateBody } as any;
			const res: NextApiResponse = { json: jest.fn() } as any;
			jest.spyOn(PostService, 'updatePost').mockResolvedValue({
				...mockPost,
				...updateBody,
			});
			await PostController.update(req, res);
			expect(res.json).toHaveBeenCalledWith(
				successResponse({
					...mockPost,
					...updateBody,
				})
			);
		});
	});

	describe('Delete Post API', () => {
		it('Should delete post by post id', async () => {
			const req: NextApiRequest = { query: { id: mockPostId } } as any;
			const res: NextApiResponse = { json: jest.fn() } as any;
			jest.spyOn(PostService, 'deletePost').mockResolvedValue(mockPost);
			await PostController.destroy(req, res);
			expect(res.json).toHaveBeenCalledWith(successResponse(mockPost));
		});
	});
});
