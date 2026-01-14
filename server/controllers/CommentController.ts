import BaseError from "@lib/commons/errors/BaseError";
import Network from "@lib/utils/network";
import CommentService from "@server/services/CommentService";
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
    console.log(network, params);
    return network.successResponse(null);
    // try {
    //   const { taskId } = params;
    //   if (!taskId) throw new BaseError("Task ID is required");

    //   const body = (await request.json()) as { content?: string; [key: string]: unknown };
    //   if (!body.content) throw new BaseError("Content is required");

    //   const createCommentDto: CreateCommentDto = {
    //     content: body.content,
    //     // Add other required properties for CreateCommentDto here, e.g.:
    //     // taskId: taskId,
    //     // authorId: ...,
    //     // etc.
    //   };
    //   const newCommentBody = await CommentService.createComment(createCommentDto);
    //   return network.successResponse(newCommentBody);
    // } catch (error) {
    //   return network.failResponse(error as BaseError);
    // }
  }
}
export default CommentController.makeInstance();
