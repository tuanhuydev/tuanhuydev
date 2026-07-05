import { CreateCategoryDTO } from "@server/dto/category.dto";
import { CategoryModel } from "@server/models/category.model";
import { CategoryDocument } from "@server/mongo/category.document";
import { categoryRepository, MongoCategoryRepository } from "@server/repositories/MongoCategoryRepository";
import { BSON, UpdateResult } from "mongodb";

export class CategoryService {
  static instance: CategoryService;

  constructor(private repository: MongoCategoryRepository) {}

  static makeInstance(categoryRepository: MongoCategoryRepository) {
    return CategoryService.instance ?? new CategoryService(categoryRepository);
  }

  async createCategory(data: CreateCategoryDTO): Promise<CategoryModel> {
    const result = await this.repository.create(data);
    if (!result) {
      throw new Error("Failed to create category");
    }
    const categoryModel: CategoryModel | null = await this.getOneCategory(result.insertedId.toHexString());
    if (!categoryModel) {
      throw new Error("Failed to create category");
    }
    return categoryModel;
  }

  async getAllCategories(params: Record<string, unknown> = {}): Promise<CategoryModel[]> {
    const categoryDocuments: CategoryDocument[] = await this.repository.findAll(params);
    return categoryDocuments.map((doc) => CategoryModel.toModel(doc));
  }

  async getOneCategory(id: string): Promise<CategoryModel | null> {
    const categoryDocument: CategoryDocument | null = await this.repository.findOne(id);
    if (!categoryDocument) {
      return null;
    }
    return CategoryModel.toModel(categoryDocument);
  }

  async updateCategory(id: string, data: Partial<CreateCategoryDTO>): Promise<UpdateResult<BSON.Document>> {
    const updated = await this.repository.save(id, data);
    if (!updated) {
      throw new Error("Failed to update category");
    }
    return updated;
  }

  async deleteCategory(id: string): Promise<UpdateResult<BSON.Document>> {
    const deleted = await this.repository.softDelete(id);
    if (!deleted) {
      throw new Error("Failed to delete category");
    }
    return deleted;
  }
}

export const categoryService = CategoryService.makeInstance(categoryRepository);
