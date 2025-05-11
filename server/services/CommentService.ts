import AuthService from "./AuthService";
import BaseError from "@lib/commons/errors/BaseError";
import { CreateCommentDto } from "@server/dto/Comment";
import MongoCommentRepository from "@server/repositories/MongoCommentRepository";

class CommentService {
  static #instance: CommentService;

  static makeInstance() {
    return CommentService.#instance ?? new CommentService();
  }
  async getAll(filter: any) {}
  async getCommentsByTaskId(taskId: string) {
    if (!taskId) throw new BaseError("Task ID is required");
    const comments = await MongoCommentRepository.getCommentsByTaskId(taskId);

    if (!comments) throw new BaseError("Failed to fetch comments");
    return comments;
  }
  async createComment(body: CreateCommentDto) {
    // Attached current user to the comment
    const currentUser = await AuthService.getCurrentUserProfile();
    if (!currentUser) throw new BaseError("User not authenticated");
    const newCommentBody = {
      ...body,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
    };
    const newComment = await MongoCommentRepository.createComment(newCommentBody);
    if (!newComment) throw new BaseError("Failed to create comment");
    return newComment;
  }
}
export default CommentService.makeInstance();
