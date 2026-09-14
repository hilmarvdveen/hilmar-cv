import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import typescript from "typescript";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = resolvePath(scriptDirectory, "..", "src");
const extensions = [".ts", ".tsx", "/index.ts", "/index.tsx", ".json"];

const firstExistingPath = (candidate) => {
  if (existsSync(candidate) && !candidate.endsWith("/")) return candidate;
  for (const extension of extensions) {
    const withExtension = `${candidate}${extension}`;
    if (existsSync(withExtension)) return withExtension;
  }
  return null;
};

const isRelative = (specifier) => specifier.startsWith("./") || specifier.startsWith("../");

const resolveSpecifier = (specifier, parentUrl) => {
  if (specifier.startsWith("@/")) {
    return firstExistingPath(resolvePath(sourceDirectory, specifier.slice(2)));
  }
  if (isRelative(specifier) && parentUrl && parentUrl.startsWith("file:")) {
    return firstExistingPath(resolvePath(dirname(fileURLToPath(parentUrl)), specifier));
  }
  return null;
};

export function registerTypescriptModuleHooks() {
  registerHooks({
    resolve(specifier, context, nextResolve) {
      const resolvedPath = resolveSpecifier(specifier, context.parentURL);
      if (!resolvedPath) return nextResolve(specifier, context);
      return { url: pathToFileURL(resolvedPath).href, shortCircuit: true };
    },
    load(url, context, nextLoad) {
      if (!url.startsWith("file:") || !/\.tsx?$/.test(url)) return nextLoad(url, context);
      const filePath = fileURLToPath(url);
      const transpiled = typescript.transpileModule(readFileSync(filePath, "utf8"), {
        compilerOptions: {
          module: typescript.ModuleKind.ESNext,
          target: typescript.ScriptTarget.ES2022,
          jsx: typescript.JsxEmit.ReactJSX,
          verbatimModuleSyntax: false,
        },
        fileName: filePath,
      });
      return { format: "module", source: transpiled.outputText, shortCircuit: true };
    },
  });
}
