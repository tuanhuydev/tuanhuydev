import { isDevelopmentEnv } from "@lib/commons/constants/base";

class LogService {
  static #instance: LogService;

  static makeInstance() {
    return LogService.#instance ?? new LogService();
  }

  log(...args: unknown[]) {
    if (isDevelopmentEnv) {
      console.log(...args);
    }
  }

  error(...args: unknown[]) {
    if (isDevelopmentEnv) {
      console.error(...args);
    }
  }
}
export default LogService.makeInstance();
