import { PostDocument } from "@server/mongo/post.document";

type ISODateString = string;

type PostConstructorInput = {
  title: string;
  content: string;
  thumbnail?: string;
  publishedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
  slug: string;
  authorId: string | null;
  assets?: string[];
  categoryId?: string | null;
  seriesId?: string | null;
  tagIds?: string[];
};

export type PostJSON = {
  id?: string;
  title: string;
  content: string;
  thumbnail?: string;
  publishedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
  slug: string;
  authorId: string | null;
  assets: string[];
  categoryId: string | null;
  seriesId: string | null;
  tagIds: string[];
};

export class PostModel {
  public readonly _id?: string;

  public title: string;
  public content: string;
  public thumbnail?: string;
  public createdAt: ISODateString;
  public updatedAt: ISODateString;
  public publishedAt: ISODateString | null;
  public deletedAt: ISODateString | null;
  public slug: string;
  public authorId: string | null;
  public assets: string[];
  public categoryId: string | null;
  public seriesId: string | null;
  public tagIds: string[];

  constructor(input: PostConstructorInput, _id?: string) {
    this._id = _id;
    this.title = input.title;

    this.content = input.content;
    this.thumbnail = input.thumbnail;
    this.publishedAt = input.publishedAt;

    this.slug = input.slug;
    this.authorId = input.authorId;
    this.assets = input.assets ?? [];
    this.categoryId = input.categoryId ?? null;
    this.seriesId = input.seriesId ?? null;
    this.tagIds = input.tagIds ?? [];

    this.createdAt = input.createdAt ?? new Date().toISOString();
    this.updatedAt = input.updatedAt ?? new Date().toISOString();
    this.deletedAt = null;
  }

  static toModel(doc: PostDocument) {
    return new PostModel(
      {
        title: doc.title,
        content: doc.content,
        thumbnail: doc.thumbnail,
        publishedAt: doc.publishedAt,
        slug: doc.slug,
        authorId: doc?.authorId && doc?.authorId?.toHexString ? doc.authorId.toHexString() : null,
        assets: doc.assets,
        categoryId: doc?.categoryId && doc?.categoryId?.toHexString ? doc.categoryId.toHexString() : null,
        seriesId: doc?.seriesId && doc?.seriesId?.toHexString ? doc.seriesId.toHexString() : null,
        tagIds: Array.isArray(doc?.tagIds) ? doc.tagIds.map((tagId) => tagId.toHexString()) : [],
        createdAt: doc.createdAt,
        deletedAt: doc.deletedAt,
        updatedAt: doc.updatedAt,
      },
      doc._id.toHexString(),
    );
  }

  toJSON(): PostJSON {
    return {
      id: this._id,
      title: this.title,
      content: this.content,
      thumbnail: this.thumbnail,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      slug: this.slug,
      authorId: this.authorId,
      assets: this.assets,
      categoryId: this.categoryId,
      seriesId: this.seriesId,
      tagIds: this.tagIds,
    };
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }

  isPublished(): boolean {
    return !!this.publishedAt && this.deletedAt === null;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
