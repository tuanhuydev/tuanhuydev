import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import UnauthorizedError from "@lib/commons/errors/UnauthorizedError";
import { transformTextToDashed } from "@lib/utils/helper";
import { CreateTagDTO, createTagSchema, UpdateTagDTO } from "@server/dto/tag.dto";
import { TagJSON, TagModel } from "@server/models/tag.model";
import { authService, AuthService } from "@server/services/AuthService";
import { tagService } from "@server/services/TagService";
import Network from "@server/utils/network";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export class TagController {
  public static instance: TagController;

  static makeInstance(authService: AuthService) {
    return TagController.instance ?? new TagController(authService);
  }

  constructor(private readonly authService: AuthService) {}

  async store(request: NextRequest) {
    const network = new Network(request);
    try {
      const body = (await network.getBody()) as CreateTagDTO;
      if (body?.name && !body?.slug) {
        body.slug = transformTextToDashed(body.name);
      }
      const validation = createTagSchema.safeParse(body);
      if (!validation.success) throw new BadRequestError(validation?.error.toString());

      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const newTag = (await tagService.createTag(body)) as unknown as TagModel;
      revalidateTag("tags", "max");
      return network.successResponse(newTag.toJSON());
    } catch (error) {
      console.error(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = new Network(request);
    try {
      const params: Record<string, unknown> = network.extractSearchParams();
      const tagModels: TagModel[] = await tagService.getAllTags(params);

      const tags: TagJSON[] = tagModels.map((tag: TagModel) => tag.toJSON());
      return network.successResponse(tags);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: { id: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      const tagById = await tagService.getOneTag(id);
      if (!tagById) throw new BadRequestError("Tag not found");

      return network.successResponse(tagById.toJSON());
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: { id: string }) {
    const body = (await request.json()) as UpdateTagDTO;
    if (body?.slug) {
      body.slug = transformTextToDashed(body.slug);
    }
    if (!id || !body) throw new BadRequestError();

    const network = new Network(request);
    try {
      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const updated = await tagService.updateTag(id, body);
      revalidateTag("tags", "max");
      return network.successResponse(updated);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: { id: string }) {
    if (!id) throw new BadRequestError();
    const network = new Network(request);
    try {
      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const deleted = await tagService.deleteTag(id);
      revalidateTag("tags", "max");
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export const tagController = TagController.makeInstance(authService);
