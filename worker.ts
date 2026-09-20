type WorkerEnv = {
  ASSETS: { fetch(request: Request): Promise<Response> };
};

async function assets(request: Request, env: WorkerEnv) {
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404 || !request.headers.get("accept")?.includes("text/html")) return response;
  return env.ASSETS.fetch(new Request(new URL("/", request.url), request));
}

export default {
  fetch(request: Request, env: WorkerEnv) {
    return assets(request, env);
  },
};
