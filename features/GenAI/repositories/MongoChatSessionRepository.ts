import { UpdateChatSessionDTO } from "../dto/ChatSessionDTOs";
import ChatSession from "../models/ChatSession";
import * as Mongo from "mongodb";
import MongoService from "server/services/MongoService";

type ChatSessionOrderBy = { field: string; direction: "asc" | "desc" };
type ChatSessionFilter = {
  page?: number;
  pageSize?: number;
  orderBy?: ChatSessionOrderBy[];
  search?: string;
  userId?: string;
};

class MongoChatSessionRepository {
  static #instance: MongoChatSessionRepository;
  private table: Mongo.Collection<Mongo.BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("chatSessions");
  }

  static makeInstance() {
    return MongoChatSessionRepository.#instance ?? new MongoChatSessionRepository();
  }

  async getChatSessions(filter: ChatSessionFilter = {}) {
    let defaultWhere: Record<string, unknown> = { deletedAt: null };
    if (!filter) {
      return this.table.find(defaultWhere).toArray();
    }

    const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "", userId } = filter;

    // Apply userId filter if provided
    if (userId) {
      defaultWhere = { ...defaultWhere, userId };
    }

    // Apply search filter for session name
    if ("search" in filter) {
      defaultWhere = { ...defaultWhere, name: { $regex: search, $options: "i" } };
    }

    let query = this.table.find(defaultWhere);

    // Apply sorting
    if (orderBy) {
      const sort: Record<string, unknown> = {};
      (orderBy as unknown[]).forEach((order: unknown) => {
        sort[(order as { field: string; direction: string }).field] =
          (order as { field: string; direction: string }).direction === "desc" ? -1 : 1;
      });
      query = query.sort(sort as Mongo.Sort);
    }

    // Apply pagination
    if (page && pageSize) {
      query = query.skip((page - 1) * pageSize).limit(pageSize);
    } else if (pageSize) {
      query = query.limit(pageSize);
    }

    return query.toArray();
  }

  async getChatSession(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id), deletedAt: null });
  }

  async getChatSessionName(id: string) {
    const session = await this.table.findOne(
      { _id: new Mongo.ObjectId(id), deletedAt: null },
      { projection: { name: 1 } },
    );
    return session?.name as string | undefined;
  }

  async getChatSessionsByUserId(userId: string, filter: Record<string, unknown> = {}) {
    return this.getChatSessions({ ...filter, userId });
  }

  async createChatSession(body: ChatSession) {
    const newChatSession = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    return this.table.insertOne(newChatSession);
  }

  async updateChatSession(id: string, body: UpdateChatSessionDTO) {
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: updateData });
  }

  async deleteChatSession(id: string) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: { deletedAt: new Date() } });
  }

  async addMessageToChatSession(
    sessionId: string,
    message: { role: string; content: string },
    options?: { session?: Mongo.ClientSession },
  ) {
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date(),
    };
    return this.table.updateOne(
      { _id: new Mongo.ObjectId(sessionId) },
      {
        $push: { messages: messageWithTimestamp } as unknown as Mongo.UpdateFilter<Mongo.BSON.Document>,
        $set: { updatedAt: new Date() },
      },
      options,
    );
  }

  async clearChatSessionMessages(sessionId: string) {
    return this.table.updateOne(
      { _id: new Mongo.ObjectId(sessionId) },
      {
        $set: {
          messages: [],
          updatedAt: new Date(),
        },
      },
    );
  }

  async getRecentChatSessions(userId: string, limit: number = 10) {
    return this.table.find({ userId, deletedAt: null }).sort({ updatedAt: -1 }).limit(limit).toArray();
  }
}

export default MongoChatSessionRepository.makeInstance();
export { type MongoChatSessionRepository };
