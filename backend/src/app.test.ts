import { beforeEach, describe, expect, test } from "bun:test";
import type { ApiError, Task } from "../../shared/types";
import { createApi } from "./app";

describe("Tasks API", () => {
  let api: ReturnType<typeof createApi>;
  beforeEach(() => { api = createApi(); });

  function request(path: string, method = "GET", body?: unknown) {
    return api(new Request(`http://localhost${path}`, {
      method,
      ...(body === undefined ? {} : { body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
    }));
  }

  test("reports backend health", async () => {
    const response = await request("/api/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok", runtime: `Bun ${Bun.version}` });
  });

  test("creates, lists, completes, and deletes a task", async () => {
    expect(await (await request("/api/tasks")).json()).toEqual([]);
    const created = await request("/api/tasks", "POST", { title: "  Learn Bun  " });
    expect(created.status).toBe(201);
    const task = await created.json() as Task;
    expect(task.title).toBe("Learn Bun");
    expect(task.completed).toBe(false);
    expect(task.id).toBeString();
    expect(Number.isNaN(Date.parse(task.createdAt))).toBe(false);
    expect(await (await request("/api/tasks")).json()).toEqual([task]);

    const updated = await request(`/api/tasks/${task.id}`, "PATCH", { completed: true });
    expect(updated.status).toBe(200);
    expect((await updated.json() as Task).completed).toBe(true);
    const deleted = await request(`/api/tasks/${task.id}`, "DELETE");
    expect(deleted.status).toBe(200);
    expect(await deleted.json()).toEqual({ success: true });
    expect(await (await request("/api/tasks")).json()).toEqual([]);
  });

  test.each([{}, null, [], { title: "   " }, { title: 123 }, { title: "x".repeat(121) }])("rejects invalid task input: %j", async (body) => {
    const response = await request("/api/tasks", "POST", body);
    expect(response.status).toBe(400);
    expect((await response.json() as ApiError).error).toBeString();
    expect(await (await request("/api/tasks")).json()).toEqual([]);
  });

  test("accepts the maximum title length and returns newest tasks first", async () => {
    const first = await (await request("/api/tasks", "POST", { title: "First" })).json() as Task;
    const second = await (await request("/api/tasks", "POST", { title: "x".repeat(120) })).json() as Task;
    expect(await (await request("/api/tasks")).json()).toEqual([second, first]);
  });

  test("rejects malformed JSON without crashing", async () => {
    const response = await api(new Request("http://localhost/api/tasks", { method: "POST", body: "{broken" }));
    expect(response.status).toBe(400);
    expect((await response.json() as ApiError).error).toBe("Request body must be valid JSON.");
  });

  test("rejects invalid completion values without changing the task", async () => {
    const task = await (await request("/api/tasks", "POST", { title: "Keep active" })).json() as Task;
    for (const body of [null, {}, { completed: "true" }]) {
      expect((await request(`/api/tasks/${task.id}`, "PATCH", body)).status).toBe(400);
    }
    expect(await (await request("/api/tasks")).json()).toEqual([task]);
  });

  test("returns JSON errors for missing tasks, routes, and unsupported methods", async () => {
    expect((await request("/api/tasks/missing", "DELETE")).status).toBe(404);
    expect((await request("/api/tasks/missing", "PATCH", { completed: true })).status).toBe(404);
    expect((await request("/api/missing")).status).toBe(404);
    const response = await request("/api/tasks", "PUT", {});
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET, POST");
  });
});
