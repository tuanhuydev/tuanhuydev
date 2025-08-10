import { isDevelopmentEnv } from "@lib/commons/constants/base";

class LogService {
  static #instance: LogService;

  static makeInstance() {
    return LogService.#instance ?? new LogService();
  }

  log(...args: any[]) {
    if (isDevelopmentEnv) {
      return console.log(...args);
    }
  }

  error(...args: any[]) {
    if (isDevelopmentEnv) {
      return console.error(...args);
    }
  }
}
export default LogService.makeInstance();
