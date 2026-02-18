import { ApiError, ApiTimeoutError } from "./errors";

const DEFAULT_TIMEOUT_MS = 10000;
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        typeof body === "object" && body && "message" in body
          ? String((body as { message: unknown }).message)
          : `HTTP ${response.status}`,
        response.status,
        body,
      );
    }

    return body as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiTimeoutError();
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
