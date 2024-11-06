export class BaseResponse {
  constructor(
    public success: boolean,
    public data?: Record<string, any>,
    public errors?: Record<string, any>,
  ) {}
}

export class SuccessResponse extends BaseResponse {
  constructor(data: Record<string, any>) {
    super(true, data);
  }
}

export class ErrorResponse extends BaseResponse {
  constructor(errors: Record<string, any>) {
    super(false, undefined, errors);
  }
}
