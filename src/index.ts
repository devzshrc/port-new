import { serve } from "bun";
import index from "./index.html";
import { githubActivity } from "./lib/github";
import { leetcodeStats } from "./lib/leetcode";
import { handleContact } from "./lib/contact";
import { handleSubscribe } from "./lib/subscribe";

const server = serve({
  routes: {
    "/api/leetcode-stats": leetcodeStats,
    "/api/github-activity": githubActivity,
    "/api/subscribe": (request: Request) => handleSubscribe(request, { RESEND_API_KEY: process.env.RESEND_API_KEY, RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID }),
    "/api/contact": (request: Request) => handleContact(request, { RESEND_API_KEY: process.env.RESEND_API_KEY, CONTACT_TO: process.env.CONTACT_TO }),
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Portfolio running at ${server.url}`);
