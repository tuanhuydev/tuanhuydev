import { isDevelopmentEnv } from "@lib/shared/commons/constants/base";

class LogService {
  static #instance: LogService;

  static makeInstance() {
    return LogService.#instance ?? new LogService();
  }
  log(error: string | Error | unknown) {
    if (isDevelopmentEnv) {
      if (error instanceof Error) return console.error((error as Error).message);
      return console.log(error);
    }
  }
}
export default LogService.makeInstance();
