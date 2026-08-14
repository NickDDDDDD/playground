import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const name = process.argv[2];

if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
  console.error("Usage: pnpm create:experiment my-experiment");
  process.exit(1);
}

const root = process.cwd();
const experimentDir = join(root, "experiments", name);
const title = name
  .split("-")
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join(" ");
const componentName = `${title.replaceAll(" ", "")}Page`;
const exportName = `${name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}Experiment`;

await mkdir(join(experimentDir, "src"), { recursive: true });

await writeFile(
  join(experimentDir, "package.json"),
  `${JSON.stringify(
    {
      name: `@playground/experiment-${name}`,
      private: true,
      version: "0.1.0",
      type: "module",
      exports: {
        ".": "./src/route.tsx"
      },
      scripts: {
        dev: "vite --host 0.0.0.0",
        build: "tsc -p tsconfig.json --noEmit && vite build",
        typecheck: "tsc -p tsconfig.json --noEmit",
        lint: "eslint ."
      },
      dependencies: {
        "@playground/experiment-contract": "workspace:*",
        "@playground/ui": "workspace:*",
        "@reduxjs/toolkit": "^2.12.0",
        "@tailwindcss/vite": "^4.3.3",
        "lucide-react": "^1.31.0",
        react: "^19.2.8",
        "react-dom": "^19.2.8",
        "react-redux": "^9.3.0",
        "react-router-dom": "^7.18.2",
        tailwindcss: "^4.3.3",
        vite: "^8.2.1"
      },
      devDependencies: {
        "@types/react": "^19.2.7",
        "@types/react-dom": "^19.2.3",
        "@vitejs/plugin-react": "^6.0.5",
        typescript: "^6.0.3"
      }
    },
    null,
    2
  )}\n`
);

await writeFile(
  join(experimentDir, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
  `
);

await writeFile(
  join(experimentDir, "tsconfig.json"),
  `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src", "vite.config.ts"]
}
`
);

await writeFile(
  join(experimentDir, "vite.config.ts"),
  `import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()]
});
`
);

await writeFile(
  join(experimentDir, "src", "vite-env.d.ts"),
  `/// <reference types="vite/client" />
`
);

await writeFile(
  join(experimentDir, "src", "main.tsx"),
  `import "@playground/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { standaloneStore } from "./standalone-store";
import { ${componentName} } from "./${name}-page";

const router = createBrowserRouter([
  {
    path: "*",
    element: <${componentName} />
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={standaloneStore}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
`
);

await writeFile(
  join(experimentDir, "src", "route.tsx"),
  `import type { ExperimentModule } from "@playground/experiment-contract";
import { ${componentName} } from "./${name}-page";

export const ${exportName}: ExperimentModule = {
  id: "${name}",
  title: "${title}",
  description: "Describe the learning goal for this experiment.",
  path: "/experiments/${name}",
  tags: ["react"],
  Component: ${componentName}
};
`
);

await writeFile(
  join(experimentDir, "src", "standalone-store.ts"),
  `import { configureStore } from "@reduxjs/toolkit";

export const standaloneStore = configureStore({
  reducer: {}
});
`
);

await writeFile(
  join(experimentDir, "src", `${name}-page.tsx`),
  `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@playground/ui";

export function ${componentName}() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary">Experiment</p>
        <h1 className="text-3xl font-semibold tracking-normal">${title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Describe the learning goal for this experiment.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spec first</CardTitle>
          <CardDescription>
            Start by updating specs/experiments/${name}.md, then implement the behavior.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            This package can be mounted by the shell or started independently with pnpm.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
`
);

await writeFile(
  join(root, "specs", "experiments", `${name}.md`),
  `# ${title} 实验规格

## 目标

描述这个实验要探索的技术或想法。

## 用户体验

描述主界面和核心交互。

## 技术说明

描述使用的库、架构选择和约束。

## 验收标准

- 实验项目导出 \`ExperimentModule\`。
- 实验项目可以在 shell 中运行。
- 实验项目可以独立运行。
- typecheck 和 build 通过。
`
);

console.log(`Created experiments/${name}`);
