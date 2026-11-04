import type { ApiError, HealthResponse, Task } from "../../shared/types";

// Relative URLs use Vite's proxy in development and Bun in production.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  if (!response.ok) {
    const body: ApiError = await response.json().catch(() => ({
      error: `Request failed (${response.status}).`,
    }));
    throw new Error(body.error);
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<HealthResponse>("/health"),
  listTasks: () => request<Task[]>("/tasks"),
  createTask: (title: string) =>
    request<Task>("/tasks", { method: "POST", body: JSON.stringify({ title }) }),
  updateTask: (id: string, completed: boolean) =>
    request<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    }),
  deleteTask: (id: string) =>
    request<{ success: boolean }>(`/tasks/${id}`, { method: "DELETE" }),
};
