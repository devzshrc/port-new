import { githubActivity } from "./src/lib/github";
import { handleContact, type ContactEnv } from "./src/lib/contact";
import { handleSubscribe, type SubscribeEnv } from "./src/lib/subscribe";
import { leetcodeStats } from "./src/lib/leetcode";

type WorkerEnv = ContactEnv & SubscribeEnv & {
  ASSETS: { fetch(request: Request): Promise<Response> };
};

export default {
  fetch(request: Request, env: WorkerEnv) {
    const url = new URL(request.url);
    if (url.hostname === "www.devzshrc.in") {
      return Response.redirect(`https://devzshrc.in${url.pathname}${url.search}`, 301);
    }
    if (url.pathname === "/api/leetcode-stats") {
      return leetcodeStats(request);
    }
    if (url.pathname === "/api/subscribe") {
      return handleSubscribe(request, env);
    }
    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }
    if (url.pathname === "/api/github-activity") {
      return githubActivity(request);
    }
    return env.ASSETS.fetch(request);
  },
};
