import { NODE_ENV } from "@lib/configs/constants";

class LogService {
  static #instance: LogService;

  static makeInstance() {
    return LogService.#instance ?? new LogService();
  }
  log(message: string) {
    if (NODE_ENV !== "production") {
      console.log(message);
    }
  }
}
export default LogService.makeInstance();
