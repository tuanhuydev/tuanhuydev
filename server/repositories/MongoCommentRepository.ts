import { CreateCommentDto } from "@server/dto/Comment";
import * as Mongo from "mongodb";
import MongoService from "server/services/MongoService";

class MongoCommentRepository {
  static #instance: MongoCommentRepository;
  private table: Mongo.Collection<Mongo.BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("comments");
  }
  static makeInstance() {
    return MongoCommentRepository.#instance ?? new MongoCommentRepository();
  }
  async getComments() {
    return this.table.find().toArray();
  }
  async getComment(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }
  async createComment(body: CreateCommentDto): Promise<Mongo.InsertOneResult<Mongo.BSON.Document>> {
    const newComment = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    return this.table.insertOne(newComment);
  }
  async updateComment(id: string, body: ObjectType) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: body });
  }
  async deleteComment(id: string) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
  }
  async getCommentsByTaskId(taskId: string) {
    return this.table.find({ targetId: new Mongo.ObjectId(taskId) }).toArray();
  }
}
export default MongoCommentRepository.makeInstance();
