import { HTTP_CODE } from "../constants/httpCode";
import { NextApiResponse } from "next";

export default class BaseError extends Error {
  status = HTTP_CODE.INTERNAL_ERROR;
  res: NextApiResponse | undefined;

  constructor(message: string = "[ERROR] INTERNAL ERROR", statusCode: number = 500) {
    super(message);
    if (statusCode) {
      this.status = statusCode;
    }
  }

  getApiResponse(res: NextApiResponse) {
    return res.status(this.status).json({
      success: false,
      message: this.message,
    });
  }
}
