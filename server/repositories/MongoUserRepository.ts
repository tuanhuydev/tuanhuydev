import MongoService from "../services/MongoService";
import BadRequestError from "@lib/commons/errors/BadRequestError";
import { CreateUserDTO, UpdateUserDTO } from "@server/dto/user.dto";
import { BSON, Collection, ObjectId, Sort } from "mongodb";

class MongoUserRepository {
  static #instance: MongoUserRepository;
  table: Collection<BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("users");
  }

  static makeInstance() {
    return MongoUserRepository.#instance ?? new MongoUserRepository();
  }

  async findAll(filter: Record<string, unknown> = {}) {
    let defaultWhere: Record<string, unknown> = { deletedAt: null };
    if (!filter) {
      return this.table.find(defaultWhere).toArray();
    }

    const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

    if (filter?.search) {
      defaultWhere.name = {
        $regex: search,
        $options: "i",
      };
    }

    let query = this.table.find(defaultWhere);

    if (orderBy) {
      const sort: Record<string, unknown> = {};
      (orderBy as Array<{ field: string; direction: "asc" | "desc" }>).forEach((order) => {
        sort[order.field] = order.direction === "desc" ? -1 : 1;
      });
      query = query.sort(sort as Sort);
    }

    if (page && pageSize) {
      query = query.skip(((page as number) - 1) * (pageSize as number)).limit(pageSize as number);
    } else if (pageSize) {
      query = query.limit(pageSize as number);
    }

    return query.toArray();
  }

  async findOne(id: string) {
    return this.table.findOne({ _id: new ObjectId(id) });
  }

  async findOneByEmail(email: string): Promise<BSON.Document | null> {
    return this.table.findOne({ email });
  }

  async create(body: CreateUserDTO) {
    const { email } = body;
    if (!email) throw new BadRequestError("Email is required");

    const existingUser = await this.findOneByEmail(email);
    if (existingUser) throw new BadRequestError("Email already exists");

    return this.table.insertOne(body);
  }

  async save(id: string, body: UpdateUserDTO) {
    return this.table.updateOne({ _id: new ObjectId(id) }, { $set: body });
  }

  async softDelete(id: string) {
    return this.table.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
  }
}

export const userRepository = MongoUserRepository.makeInstance();
