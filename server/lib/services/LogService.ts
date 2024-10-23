import { NODE_ENV } from "@lib/configs/constants";

class LogService {
  static #instance: LogService;

  static makeInstance() {
    return LogService.#instance ?? new LogService();
  }
  log(error: string | Error | unknown) {
    if (NODE_ENV !== "production") {
      if (error instanceof Error) return console.error((error as Error).message);
      return console.log(error);
    }
  }
}
export default LogService.makeInstance();
