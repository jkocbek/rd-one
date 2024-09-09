export abstract class BaseError extends Error {
  readonly errorCode: string;
  protected constructor(
    errorCode: string,
    readonly message: string,
  ) {
    super(message);
    this.errorCode = errorCode;
  }
}
