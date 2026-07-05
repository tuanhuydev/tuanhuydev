import type { ISODateString } from "@lib/types";
import { TagDocument } from "@server/mongo/tag.document";

type TagConstructorInput = {
  name: string;
  slug: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
};

export type TagJSON = {
  id?: string;
  name: string;
  slug: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
};

export class TagModel {
  public readonly _id?: string;

  public name: string;
  public slug: string;
  public createdAt: ISODateString;
  public updatedAt: ISODateString;
  public deletedAt: ISODateString | null;

  constructor(input: TagConstructorInput, _id?: string) {
    this._id = _id;
    this.name = input.name;
    this.slug = input.slug;
    this.createdAt = input.createdAt ?? new Date().toISOString();
    this.updatedAt = input.updatedAt ?? new Date().toISOString();
    this.deletedAt = input.deletedAt ?? null;
  }

  static toModel(doc: TagDocument) {
    return new TagModel(
      {
        name: doc.name,
        slug: doc.slug,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        deletedAt: doc.deletedAt,
      },
      doc._id.toHexString(),
    );
  }

  toJSON(): TagJSON {
    return {
      id: this._id,
      name: this.name,
      slug: this.slug,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
