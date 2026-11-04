import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createApi } from "./app";

const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535. Check your .env file.");
}

const production = process.env.NODE_ENV === "production";
const publicDirectory = fileURLToPath(new URL("../../dist/frontend", import.meta.url));
const indexFile = Bun.file(resolve(publicDirectory, "index.html"));
if (production && !(await indexFile.exists())) {
  throw new Error("Frontend build missing. Run 'bun run build' before 'bun run start'.");
}
const handleApi = createApi();

const server = Bun.serve({
  hostname: "127.0.0.1",
  port,
  maxRequestBodySize: 16 * 1024,
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api" || pathname.startsWith("/api/")) return handleApi(request);

    if (production && (request.method === "GET" || request.method === "HEAD")) {
      let decodedPath: string;
      try {
        decodedPath = decodeURIComponent(pathname);
      } catch {
        return Response.json({ error: "Invalid URL." }, { status: 400 });
      }
      // Resolve and check the directory boundary before serving any file.
      const filePath = resolve(publicDirectory, `.${decodedPath}`);
      if (filePath !== publicDirectory && !filePath.startsWith(`${publicDirectory}${sep}`)) {
        return Response.json({ error: "Not found." }, { status: 404 });
      }
      const file = Bun.file(filePath);
      const selected = filePath !== publicDirectory && await file.exists() ? file : pathname === "/" ? indexFile : null;
      if (selected) {
        return new Response(request.method === "HEAD" ? null : selected, {
          headers: { "Content-Type": selected.type },
        });
      }
    }

    return Response.json({ error: "Not found." }, { status: 404 });
  },
  error(error) {
    console.error(error);
    return Response.json({ error: "An unexpected server error occurred." }, { status: 500 });
  },
});

console.log(`Backend ready at ${server.url}`);
if (production) console.log(`Open ${server.url} to use the application.`);
