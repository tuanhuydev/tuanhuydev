export type ISODateString = string;

type SprintConstructorInput = {
  name: string;
  description?: string | null;

  startDate?: ISODateString | null;
  endDate?: ISODateString | null;
  projectId?: string | null;
};

export class SprintModel {
  public readonly _id?: string;

  public name: string;
  public description: string | null;

  private _projectId: string | null;

  public startDate: ISODateString | null;
  public endDate: ISODateString | null;

  public createdAt: ISODateString;
  public updatedAt: ISODateString;
  public deletedAt: ISODateString | null;

  constructor(input: SprintConstructorInput, id?: string) {
    this._id = id;

    this.name = input.name;
    this.description = input.description ?? null;

    this._projectId = input.projectId ?? null;
    this.startDate = input.startDate ?? null;
    this.endDate = input.endDate ?? null;

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

  /* =====================
     Setters 
     ===================== */

  setProject(projectId: string | null) {
    this._projectId = projectId;
    this.touch();
  }

  setSchedule(startDate: ISODateString | null, endDate: ISODateString | null) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.touch();
  }

  rename(name: string) {
    this.name = name;
    this.touch();
  }

  updateDescription(description: string | null) {
    this.description = description;
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
}
