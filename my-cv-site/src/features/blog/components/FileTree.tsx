import { Folder, FileCode } from "lucide-react";

export type FileNode = {
  name: string;
  type?: "dir" | "file";
  comment?: string;
  children?: FileNode[];
};

function isDir(node: FileNode): boolean {
  return node.type ? node.type === "dir" : Array.isArray(node.children);
}

function TreeRows({ nodes, nested }: { nodes: FileNode[]; nested: boolean }) {
  return (
    <ul className={nested ? "pl-5" : undefined}>
      {nodes.map((node, index) => {
        const isDirectory = isDir(node);
        return (
          <li key={`${node.name}-${index}`}>
            <div className="flex items-start gap-2 py-1">
              {isDirectory ? (
                <Folder className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" aria-hidden="true" />
              ) : (
                <FileCode className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
              )}
              <span className="flex min-w-0 flex-col sm:flex-row sm:flex-wrap sm:gap-x-2">
                <span className={isDirectory ? "font-semibold text-gray-100" : "text-gray-300"}>
                  <span className="sr-only">{isDirectory ? "folder " : "file "}</span>
                  {node.name}
                </span>
                {node.comment && (
                  <span className="text-xs text-gray-400 sm:text-sm"># {node.comment}</span>
                )}
              </span>
            </div>
            {node.children && node.children.length > 0 && (
              <TreeRows nodes={node.children} nested />
            )}
          </li>
        );
      })}
    </ul>
  );
}

const FILE_TREE_LABEL = "File tree";

export function FileTree({ tree, caption }: { tree: FileNode[]; caption?: string }) {
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-sm">
      <div
        role="region"
        aria-label={caption ?? FILE_TREE_LABEL}
        tabIndex={0}
        className="overflow-x-auto px-4 py-4 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-300"
      >
        <TreeRows nodes={tree} nested={false} />
      </div>
      {caption && (
        <figcaption className="border-t border-gray-800 px-4 py-2 text-xs text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
