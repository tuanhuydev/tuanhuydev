import type { ISODateString } from "@lib/types";
import { CategoryDocument } from "@server/mongo/category.document";

type CategoryConstructorInput = {
  name: string;
  slug: string;
  description?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
};

export type CategoryJSON = {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
};

export class CategoryModel {
  public readonly _id?: string;

  public name: string;
  public slug: string;
  public description?: string;
  public createdAt: ISODateString;
  public updatedAt: ISODateString;
  public deletedAt: ISODateString | null;

  constructor(input: CategoryConstructorInput, _id?: string) {
    this._id = _id;
    this.name = input.name;
    this.slug = input.slug;
    this.description = input.description;
    this.createdAt = input.createdAt ?? new Date().toISOString();
    this.updatedAt = input.updatedAt ?? new Date().toISOString();
    this.deletedAt = input.deletedAt ?? null;
  }

  static toModel(doc: CategoryDocument) {
    return new CategoryModel(
      {
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        deletedAt: doc.deletedAt,
      },
      doc._id.toHexString(),
    );
  }

  toJSON(): CategoryJSON {
    return {
      id: this._id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
