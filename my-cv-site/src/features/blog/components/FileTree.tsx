import { Folder, FileCode } from "lucide-react";

export type FileNode = {
  name: string;
  /** Defaults to `dir` when `children` is present, otherwise `file`. */
  type?: "dir" | "file";
  /** Inline annotation shown muted to the right of the name. */
  comment?: string;
  children?: FileNode[];
};

function isDir(node: FileNode): boolean {
  return node.type ? node.type === "dir" : Array.isArray(node.children);
}

function TreeRows({ nodes, depth }: { nodes: FileNode[]; depth: number }) {
  return (
    <>
      {nodes.map((node, i) => {
        const dir = isDir(node);
        return (
          <div key={`${node.name}-${i}`}>
            <div
              className="flex items-center gap-2 py-1"
              style={{ paddingLeft: `${depth * 1.25}rem` }}
            >
              {dir ? (
                <Folder className="h-4 w-4 flex-shrink-0 text-blue-400" aria-hidden="true" />
              ) : (
                <FileCode className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
              )}
              <span className={dir ? "font-semibold text-gray-100" : "text-gray-300"}>
                {node.name}
              </span>
              {node.comment && (
                <span className="text-gray-500"># {node.comment}</span>
              )}
            </div>
            {node.children && node.children.length > 0 && (
              <TreeRows nodes={node.children} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </>
  );
}

/** Renders a project/folder structure as an annotated, monospaced tree. */
export function FileTree({ tree, caption }: { tree: FileNode[]; caption?: string }) {
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-sm">
      <div className="overflow-x-auto px-4 py-4 font-mono text-sm">
        <TreeRows nodes={tree} depth={0} />
      </div>
      {caption && (
        <figcaption className="border-t border-gray-800 px-4 py-2 text-xs text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
