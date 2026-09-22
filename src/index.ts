import { serve } from "bun";
import index from "./index.html";
import { leetcodeStats } from "./lib/leetcode";

const server = serve({
  routes: {
    "/api/leetcode-stats": leetcodeStats,
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Portfolio running at ${server.url}`);
