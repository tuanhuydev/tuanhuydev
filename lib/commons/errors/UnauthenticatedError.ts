import BaseError from "./BaseError";

class UnauthenticatedError extends BaseError {
  constructor(message: string) {
    super(message, 401);
  }
}

export default UnauthenticatedError;
