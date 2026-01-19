import { UserDocument } from "@server/mongo/user.document";

export type ISOString = string;

export type UserJSON = {
  id?: string;
  name: string;
  email: string;

  createdAt: ISOString;
  updatedAt: ISOString;
  deletedAt: ISOString | null;
};
export type UserInputConstructor = {
  name: string;
  email: string;
  password: string;
  createdAt: ISOString;
  updatedAt: ISOString;
  deletedAt: ISOString | null;
};

export class UserModel {
  public readonly _id?: string;
  public name: string;
  public email: string;
  private _password: string;
  public createdAt: ISOString;
  public updatedAt: ISOString;
  public deletedAt: ISOString | null;

  constructor(input: UserInputConstructor, _id: string) {
    this._id = _id;
    this.name = input.name;
    this.email = input.email;

    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.deletedAt = input.deletedAt;

    this._password = input.password;
  }

  get password() {
    return this._password;
  }

  toJSON(): UserJSON {
    return {
      id: this._id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  static toModel(doc: UserDocument) {
    return new UserModel(
      {
        name: doc.name,
        email: doc.email,
        password: doc.password,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        deletedAt: doc.deletedAt,
      },
      doc._id.toHexString(),
    );
  }
}
