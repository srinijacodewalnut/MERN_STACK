import type { Task } from "../../shared/types";

const jsonError = (error: string, status: number) => Response.json({ error }, { status });
const methodNotAllowed = (allow: string) =>
  Response.json({ error: "Method not allowed." }, { status: 405, headers: { Allow: allow } });

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A fresh store per app keeps tests isolated. Data resets when Bun restarts. */
export function createApi() {
  const tasks = new Map<string, Task>();

  return async function handleApi(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;

    if (pathname === "/api/health") {
      if (method !== "GET") return methodNotAllowed("GET");
      return Response.json({ status: "ok", runtime: `Bun ${Bun.version}` });
    }

    if (pathname === "/api/tasks") {
      if (method === "GET") return Response.json([...tasks.values()].reverse());
      if (method !== "POST") return methodNotAllowed("GET, POST");

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return jsonError("Request body must be valid JSON.", 400);
      }
      if (!isObject(body) || typeof body.title !== "string" || !body.title.trim() || body.title.trim().length > 120) {
        return jsonError("Title must be between 1 and 120 characters.", 400);
      }

      const task: Task = {
        id: crypto.randomUUID(),
        title: body.title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      tasks.set(task.id, task);
      return Response.json(task, { status: 201 });
    }

    const match = pathname.match(/^\/api\/tasks\/([^/]+)$/);
    if (match) {
      if (method !== "PATCH" && method !== "DELETE") return methodNotAllowed("PATCH, DELETE");
      const task = tasks.get(match[1]!);
      if (!task) return jsonError("Task not found.", 404);

      if (method === "DELETE") {
        tasks.delete(task.id);
        return Response.json({ success: true });
      }

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return jsonError("Request body must be valid JSON.", 400);
      }
      if (!isObject(body) || typeof body.completed !== "boolean") {
        return jsonError("Completed must be a boolean (true or false).", 400);
      }
      const updated = { ...task, completed: body.completed };
      tasks.set(task.id, updated);
      return Response.json(updated);
    }

    return jsonError("API route not found.", 404);
  };
}
