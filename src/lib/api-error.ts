export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function makeApiError(code: string, message: string, details?: unknown): ApiError {
  return { code, message, details };
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    typeof (value as Record<string, unknown>)["code"] === "string" &&
    typeof (value as Record<string, unknown>)["message"] === "string"
  );
}
