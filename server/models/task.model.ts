import { TaskDocument } from "@server/mongo/task.document";
import { ObjectId } from "mongodb";

export enum TASK_TYPE {
  BUG = "BUG",
  ISSUE = "ISSUE",
  STORY = "STORY",
  EPIC = "EPIC",
}

type ProjectId = string;
type SprintId = string;
type UserId = string;
type ISODateString = string;
type ParentTaskId = string;

type TaskConstructorInput = {
  title: string;
  description?: string;
  type: TASK_TYPE;
  storyPoint?: number;

  projectId: ProjectId | null;
  sprintId: SprintId | null;
  assigneeId: UserId | null;
  createdById: UserId | null;
  parentTaskId: ParentTaskId | null;
};

export type TaskJSON = {
  id?: string;
  title: string;
  description?: string;
  type: TASK_TYPE;
  storyPoint: number;
  projectId: ProjectId | null;
  sprintId: SprintId | null;
  assigneeId: UserId | null;
  createdById: UserId | null;
  parentTaskId: ParentTaskId | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
};

export class TaskModel {
  public readonly _id?: ObjectId;

  public title: string;
  public description?: string;
  public type: TASK_TYPE;
  public storyPoint: number;

  private _projectId: ProjectId | null;
  private _sprintId: SprintId | null;
  private _assigneeId: UserId | null;
  private _createdById: UserId | null;
  private _parentTaskId: string | null;

  public createdAt: ISODateString;
  public updatedAt: ISODateString;
  public deletedAt: ISODateString | null;

  constructor(input: TaskConstructorInput, id?: ObjectId) {
    // Model level validation
    if (!input.title || input.title.trim().length === 0) {
      throw new Error("Task title is required");
    }
    if (input.storyPoint !== undefined && input.storyPoint < 0) {
      throw new Error("Story point cannot be negative");
    }

    this._id = id;

    this.title = input.title;
    this.description = input.description;
    this.type = input.type ?? TASK_TYPE.ISSUE;
    this.storyPoint = input.storyPoint ?? 0;

    this._projectId = input.projectId ?? null;
    this._sprintId = input.sprintId ?? null;
    this._assigneeId = input.assigneeId ?? null;
    this._createdById = input.createdById ?? null;
    this._parentTaskId = input.parentTaskId ?? null;

    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
    this.deletedAt = null;
  }

  /* =====================
     Getters
     ===================== */

  get projectId(): string | null {
    return this._projectId;
  }

  get sprintId(): string | null {
    return this._sprintId;
  }

  get assigneeId(): string | null {
    return this._assigneeId;
  }

  get createdById(): string | null {
    return this._createdById;
  }

  /* =====================
     Setters
     ===================== */

  setProject(projectId: string | null) {
    this._projectId = projectId;
    this.touch();
  }

  moveToSprint(sprintId: string | null) {
    this._sprintId = sprintId;
    this.touch();
  }

  assignTo(userId: string | null) {
    this._assigneeId = userId;
    this.touch();
  }

  setCreatedBy(userId: string | null) {
    this._createdById = userId;
    this.touch();
  }

  /* =====================
     Lifecycle
     ===================== */

  softDelete() {
    this.deletedAt = new Date().toISOString();
    this.touch();
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  toJSON(): TaskJSON {
    return {
      id: this._id?.toHexString(),
      title: this.title,
      description: this.description,
      type: this.type,
      storyPoint: this.storyPoint,
      projectId: this._projectId,
      sprintId: this._sprintId,
      assigneeId: this._assigneeId,
      createdById: this._createdById,
      parentTaskId: this._parentTaskId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  static toModel(doc: TaskDocument): TaskModel {
    return new TaskModel(
      {
        title: doc.title,
        description: doc.description,
        type: doc.type as TASK_TYPE,
        storyPoint: doc.storyPoint,
        projectId: doc.projectId ? doc.projectId.toHexString() : null,
        sprintId: doc.sprintId ? doc.sprintId.toHexString() : null,
        assigneeId: doc.assigneeId ? doc.assigneeId.toHexString() : null,
        createdById: doc.createdById ? doc.createdById.toHexString() : null,
        parentTaskId: doc.parentTaskId ? doc.parentTaskId.toHexString() : null,
      },
      doc._id,
    );
  }

  toDocument(): TaskDocument {
    return {
      _id: this._id ? new ObjectId(this._id) : new ObjectId(),
      title: this.title,
      description: this.description,
      type: this.type,
      storyPoint: this.storyPoint,
      projectId: this._projectId ? new ObjectId(this._projectId) : null,
      sprintId: this._sprintId ? new ObjectId(this._sprintId) : null,
      assigneeId: this._assigneeId ? new ObjectId(this._assigneeId) : null,
      createdById: this._createdById ? new ObjectId(this._createdById) : null,
      parentTaskId: this._parentTaskId ? new ObjectId(this._parentTaskId) : null,
      createdAt: new Date(this.createdAt).toISOString(),
      updatedAt: new Date(this.updatedAt).toISOString(),
      deletedAt: this.deletedAt ? new Date(this.deletedAt).toISOString() : null,
    };
  }
}
