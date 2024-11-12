import { AxiosResponse } from "axios";

export interface BaseDataResponse<T> {
  success: boolean;
  data: T;
}

type BaseFormResponseErrors<T extends object> = {
  [K in keyof T]?: string;
};

export interface BaseFormResponse<T extends object, K = {}> {
  success: boolean;
  data?: K;
  errors?: BaseFormResponseErrors<T>;
}

export const parseFormSubmitResponse = async <T extends object, K = {}>(
  callback: () => Promise<AxiosResponse<any, any>>,
) => {
  try {
    const response = await callback();

    return response.data as BaseFormResponse<T, K>;
  } catch (error: any) {
    if (error.response.status === 400) {
      return error.response.data as BaseFormResponse<T>;
    } else {
      throw error;
    }
  }
};
