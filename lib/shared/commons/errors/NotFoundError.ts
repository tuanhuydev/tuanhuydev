import { HTTP_CODE } from "../constants/httpCode";
import BaseError from "./BaseError";

export default class NotFoundError extends BaseError {
  constructor(message: string = "[ERROR] NOT FOUND") {
    super(message, HTTP_CODE.NOT_FOUND_ERROR);
  }
}
