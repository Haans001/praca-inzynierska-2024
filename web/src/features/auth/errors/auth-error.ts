import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

type AuthErrorType = "password" | "email" | "code" | "other";

export class AuthError extends Error {
  constructor(
    public type: AuthErrorType,
    public message: string,
    public code?: string,
  ) {
    super(message);
  }
}

export const isAuthError = (error: unknown): error is AuthError => {
  return error instanceof AuthError;
};

export const parseAuthError = (error: unknown) => {
  if (isClerkAPIResponseError(error)) {
    const paramNameMap: Record<string, AuthErrorType> = {
      identifier: "email",
      email_address: "email",
      password: "password",
      code: "code",
      other: "other",
    };

    const param =
      paramNameMap[error.errors[0]?.meta?.paramName ?? "other"] ?? "other";

    const code = error.errors[0]?.code;

    const message =
      error.errors[0]?.longMessage ??
      error.errors[0]?.message ??
      "Wystąpił nieznany błąd.";

    return new AuthError(param, message, code);
  } else {
    return new AuthError("other", (error as Error).message);
  }
};
