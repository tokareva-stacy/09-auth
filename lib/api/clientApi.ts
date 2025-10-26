import { User } from "../../types/user";
import type { Note, NoteFormData } from "../../types/note";

export interface ResponseAPI {
  notes: Note[];
  totalPages: number;
}

export interface OptionsAPI {
  params: {
    search: string;
    tag?: string;
    page: number;
    perPage: number;
  };
  headers?: {
    Cookie: string;
  };
}

export type UserRequest = {
  email: string;
  password: string;
};

export interface CheckSessionRequest {
  success: boolean;
}

export interface UpdateUserRequest {
  username: string;
}

const API_PREFIX = "/api";

/**
 * Helper to handle fetch responses and throw an Error-like object
 * that contains `response.data` so callers that expect Axios-like
 * error shape can still access `.response.data`.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  const payload = await res.json().catch(() => ({}));
  if (res.ok) return payload as T;

  const err: any = new Error(payload?.error ?? `HTTP ${res.status}`);
  // Provide a similar shape to AxiosError so existing error handling keeps working
  err.response = { data: payload };
  err.status = res.status;
  throw err;
}

export async function fetchNotes(
  searchWord: string,
  page: number,
  tag?: string
) {
  if (tag === "All") tag = undefined;

  const params = new URLSearchParams();
  params.set("search", searchWord ?? "");
  if (tag) params.set("tag", tag);
  params.set("page", String(page ?? 1));
  params.set("perPage", "12");

  const res = await fetch(`${API_PREFIX}/notes?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse<ResponseAPI>(res);
}

export async function fetchNoteById(id: string) {
  const res = await fetch(`${API_PREFIX}/notes/${encodeURIComponent(id)}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<Note>(res);
}

export async function createNote(data: NoteFormData) {
  // If NoteFormData contains files, this should be FormData and content type omitted.
  // Assuming it's JSON here (adjust if your create note uses multipart/form-data).
  const res = await fetch(`${API_PREFIX}/notes`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Note>(res);
}

export async function deleteNote(id: string) {
  const res = await fetch(`${API_PREFIX}/notes/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<Note>(res);
}

export async function register(data: UserRequest) {
  const res = await fetch(`${API_PREFIX}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(res);
}

export async function login(data: UserRequest) {
  const res = await fetch(`${API_PREFIX}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(res);
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_PREFIX}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  await handleResponse(res);
}

export const checkSession = async (): Promise<CheckSessionRequest> => {
  const res = await fetch(`${API_PREFIX}/auth/session`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<CheckSessionRequest>(res);
};

export async function getMe(): Promise<User> {
  const res = await fetch(`${API_PREFIX}/users/me`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<User>(res);
}

export async function updateMe(data: UpdateUserRequest): Promise<User> {
  const res = await fetch(`${API_PREFIX}/users/me`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(res);
}