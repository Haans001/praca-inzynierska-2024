export interface BaseDataResponse<T> {
  success: true;
  data: T;
}

type BaseFormResponseErrors<T extends object> = {
  [K in keyof T]?: string;
};

export interface BaseErrorResponse<T extends object> {
  success: false;
  errors: BaseFormResponseErrors<T>;
}

export type BaseFormResponse<T extends object> =
  | BaseDataResponse<T>
  | BaseErrorResponse<T>;
