import { EMPTY_STRING } from "@lib/configs/constants";
import * as mongoDB from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || EMPTY_STRING;

class MongoService {
  static #instance: MongoService;
  private database: string = "";
  private mongoClient: mongoDB.MongoClient;

  constructor() {
    this.mongoClient = new mongoDB.MongoClient(MONGO_URI);
  }

  public getDatabase() {
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
