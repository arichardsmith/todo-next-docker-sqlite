import { NextApiResponse } from "next";

type ErrorResponse = {
  status: number;
  errors: string[];
};

type SuccessResponse<T> = {
  status: 200;
  errors: null;
  data: T;
};

export type ServerResponse<T> = SuccessResponse<T> | ErrorResponse;

export function fail(status: number, errors: string | string[]): ErrorResponse {
  return {
    status,
    errors: typeof errors === "string" ? [errors] : errors,
  };
}

export function json<T>(data: T): SuccessResponse<T> {
  return {
    status: 200,
    errors: null,
    data,
  };
}
