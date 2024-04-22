import { EMPTY_STRING } from "@lib/configs/constants";
import * as mongoDB from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || EMPTY_STRING;
const MONGODB_DB = process.env.MONGODB_DB || "test";
class MongoService {
  static #instance: MongoService;
  private database: string = "";
  private mongoClient: mongoDB.MongoClient;

  constructor() {
    this.mongoClient = new mongoDB.MongoClient(MONGO_URI);
    this.setDatabase(MONGODB_DB);
  }

  public getDatabase(): mongoDB.Db {
    return this.mongoClient.db(this.database);
  }

  public setDatabase(database: string) {
    this.database = database;
  }

  static makeInstance() {
    return MongoService.#instance ?? new MongoService();
  }
}
export default MongoService.makeInstance();
