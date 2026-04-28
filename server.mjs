import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number.parseInt(process.env.PORT || "3000", 10);

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store"
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    ...noStoreHeaders(),
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(payload));
}

async function servePublicFile(res, filename, contentType) {
  const file = await readFile(path.join(__dirname, "public", filename));
  res.writeHead(200, {
    ...noStoreHeaders(),
    "Content-Type": contentType
  });
  res.end(file);
}

const challengeRoutes = new Set([
  "/",
  "/defi-7jours",
  "/client/defi-7-jours",
  "/prototype/defi-7-jours"
]);

const server = createServer(async (req, res) => {
  try {
    const rawPath = (req.url || "/").split("?")[0];
    const routePath =
      rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;

    if (req.method === "GET" && routePath === "/healthz") {
      sendJson(res, 200, { ok: true, service: "defi-7jours-univers-rebelle" });
      return;
    }

    if (req.method === "GET" && challengeRoutes.has(routePath)) {
      await servePublicFile(res, "challenge-7-jours.html", "text/html; charset=utf-8");
      return;
    }

    if (req.method === "GET" && routePath === "/univers-rebelle-logo-12.png") {
      await servePublicFile(res, "univers-rebelle-logo-12.png", "image/png");
      return;
    }

    if (req.method === "POST" && routePath === "/api/challenge-webhook-preview") {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }

      const rawBody = Buffer.concat(chunks).toString("utf8");
      let payload = null;
      try {
        payload = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        payload = rawBody;
      }

      sendJson(res, 200, {
        ok: true,
        preview: true,
        receivedAt: new Date().toISOString(),
        payload
      });
      return;
    }

    sendJson(res, 404, { error: "Route not found." });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Unknown server error"
    });
  }
});

server.listen(PORT, () => {
  console.log(`Défi 7 jours running on http://localhost:${PORT}/defi-7jours`);
});
