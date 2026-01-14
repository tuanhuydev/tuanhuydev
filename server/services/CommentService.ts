import { authService, AuthService } from "./AuthService";
import BaseError from "@lib/commons/errors/BaseError";
import { CreateCommentDto } from "@server/dto/Comment";
import { User } from "@server/models/User";
import MongoCommentRepository from "@server/repositories/MongoCommentRepository";

class CommentService {
  static #instance: CommentService;
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  private getCurrentUser = async (): Promise<User> => {
    const currentUser: User | null = await this.authService.getCurrentUserProfile();
    if (!currentUser) throw new BaseError("User not authenticated");
    return currentUser;
  };

  static makeInstance(authService: AuthService) {
    return CommentService.#instance ?? new CommentService(authService);
  }

  async getCommentsByTaskId(taskId: string) {
    if (!taskId) throw new BaseError("Task ID is required");
    const comments = await MongoCommentRepository.getCommentsByTaskId(taskId);

    if (!comments) throw new BaseError("Failed to fetch comments");
    return comments;
  }

  async createComment(body: CreateCommentDto) {
    // Attached current user to the comment
    const user = await this.getCurrentUser();
    const newCommentBody = {
      ...body,
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
    const newComment = await MongoCommentRepository.createComment(newCommentBody);
    if (!newComment) throw new BaseError("Failed to create comment");
    return newComment;
  }
}
export default CommentService.makeInstance(authService);
