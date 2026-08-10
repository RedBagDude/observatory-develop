/**
 * Centralized API Client
 */

export enum ApiErrorType {
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  VALIDATION = "VALIDATION",
  AUTH = "AUTH",
  NOT_FOUND = "NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}

export class ApiError extends Error {
  public type: ApiErrorType;
  public status?: number;
  public response?: { message?: string; errors?: Record<string, string[]> };

  constructor(
    message: string,
    type: ApiErrorType = ApiErrorType.UNKNOWN,
    status?: number,
    response?: { message?: string; errors?: Record<string, string[]> }
  ) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.status = status;
    this.response = response;
  }
}

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  next?: { tags?: string[]; revalidate?: number | false };
  credentials?: RequestCredentials;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorBody: { message?: string; errors?: Record<string, string[]> } = {};
    try {
      errorBody = await response.json();
    } catch { /* ignore */ }

    let type = ApiErrorType.SERVER;
    if (response.status === 401 || response.status === 403) type = ApiErrorType.AUTH;
    else if (response.status === 404) type = ApiErrorType.NOT_FOUND;
    else if (response.status === 422) type = ApiErrorType.VALIDATION;
    else if (response.status >= 500) type = ApiErrorType.SERVER;

    throw new ApiError(
      errorBody.message ?? `Request failed with status ${response.status}`,
      type,
      response.status,
      errorBody
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const url = new URL(`${baseUrl}${endpoint}`, "http://localhost");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function request<T>(
  method: string,
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, body, headers: extraHeaders, next, credentials, ...rest } = options as RequestOptions & Record<string, unknown>;
  const url = buildUrl(endpoint, params);

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    ...rest,
  } as RequestInit;

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }
  if (next) {
    (fetchOptions as Record<string, unknown>).next = next;
  }
  if (credentials) {
    fetchOptions.credentials = credentials;
  }

  const response = await fetch(url, fetchOptions);
  return handleResponse<T>(response);
}

export const apiClient = {
  get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return request<T>("GET", endpoint, options);
  },

  post<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>("POST", endpoint, { ...options, body });
  },

  put<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>("PUT", endpoint, { ...options, body });
  },

  patch<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return request<T>("PATCH", endpoint, { ...options, body });
  },

  delete<T = void>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return request<T>("DELETE", endpoint, options);
  },
};
