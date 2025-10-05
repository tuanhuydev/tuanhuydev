import BaseError from "@lib/commons/errors/BaseError";
import Network from "@lib/utils/network";
import { CommentType } from "@server/models/Comment";
import CommentService from "@server/services/CommentService";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export class CommentController {
  static #instance: CommentController;

  static makeInstance() {
    return CommentController.#instance ?? new CommentController();
  }

  async getAll(request: NextRequest) {
    const network = new Network(request);
    try {
      return network.successResponse([]);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getCommentsByTaskId(request: NextRequest, params: { taskId: string }) {
    const network = new Network(request);
    try {
      const { taskId } = params;
      if (!taskId) throw new BaseError("Task ID is required");
      const comments = await CommentService.getCommentsByTaskId(taskId);
      return network.successResponse(comments);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async createTaskComment(request: NextRequest, params: { taskId: string }) {
    const network = new Network(request);
    try {
      const { taskId } = params;
      if (!taskId) throw new BaseError("Task ID is required");

      const body = await request.json();
      if (!body.content) throw new BaseError("Content is required");

      const newCommentBody = await CommentService.createComment({
        ...body,
        targetId: new ObjectId(taskId),
        targetType: CommentType.TASK,
      });
      return network.successResponse(newCommentBody);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}
export default CommentController.makeInstance();
