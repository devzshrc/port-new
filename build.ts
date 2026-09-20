import tailwind from "bun-plugin-tailwind";
import { cp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const outdir = path.join(process.cwd(), "dist");
await rm(outdir, { recursive: true, force: true });

const entrypoints = [...new Bun.Glob("src/**/*.html").scanSync()];

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [tailwind],
  minify: true,
  target: "browser",
  publicPath: "/",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

for (const output of result.outputs) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}

const indexPath = path.join(outdir, "index.html");
const indexHtml = await readFile(indexPath, "utf8");
await writeFile(indexPath, indexHtml.replaceAll('href="./', 'href="/').replaceAll('src="./', 'src="/'));
await cp(path.join(process.cwd(), "public"), outdir, { recursive: true, force: true });
