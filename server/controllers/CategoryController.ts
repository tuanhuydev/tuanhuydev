import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import UnauthorizedError from "@lib/commons/errors/UnauthorizedError";
import { transformTextToDashed } from "@lib/utils/helper";
import { CreateCategoryDTO, createCategorySchema, UpdateCategoryDTO } from "@server/dto/category.dto";
import { CategoryJSON, CategoryModel } from "@server/models/category.model";
import { authService, AuthService } from "@server/services/AuthService";
import { categoryService } from "@server/services/CategoryService";
import Network from "@server/utils/network";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export class CategoryController {
  public static instance: CategoryController;

  static makeInstance(authService: AuthService) {
    return CategoryController.instance ?? new CategoryController(authService);
  }

  constructor(private readonly authService: AuthService) {}

  async store(request: NextRequest) {
    const network = new Network(request);
    try {
      const body = (await network.getBody()) as CreateCategoryDTO;
      if (body?.name && !body?.slug) {
        body.slug = transformTextToDashed(body.name);
      }
      const validation = createCategorySchema.safeParse(body);
      if (!validation.success) throw new BadRequestError(validation?.error.toString());

      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const newCategory = (await categoryService.createCategory(body)) as unknown as CategoryModel;
      revalidateTag("categories", "max");
      return network.successResponse(newCategory.toJSON());
    } catch (error) {
      console.error(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = new Network(request);
    try {
      const params: Record<string, unknown> = network.extractSearchParams();
      const categoryModels: CategoryModel[] = await categoryService.getAllCategories(params);

      const categories: CategoryJSON[] = categoryModels.map((category: CategoryModel) => category.toJSON());
      return network.successResponse(categories);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: { id: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      const categoryById = await categoryService.getOneCategory(id);
      if (!categoryById) throw new BadRequestError("Category not found");

      return network.successResponse(categoryById.toJSON());
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: { id: string }) {
    const body = (await request.json()) as UpdateCategoryDTO;
    if (body?.slug) {
      body.slug = transformTextToDashed(body.slug);
    }
    if (!id || !body) throw new BadRequestError();

    const network = new Network(request);
    try {
      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const updated = await categoryService.updateCategory(id, body);
      revalidateTag("categories", "max");
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

      const deleted = await categoryService.deleteCategory(id);
      revalidateTag("categories", "max");
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export const categoryController = CategoryController.makeInstance(authService);
