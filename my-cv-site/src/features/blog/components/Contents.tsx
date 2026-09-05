import { slugify } from "./prose";

type ContentsProps = {
  label: string;
  items: string[];
};

export function Contents({ label, items }: ContentsProps) {
  return (
    <nav aria-label={label} className="my-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
      <p className="text-[13px] font-bold uppercase tracking-widest text-primary">{label}</p>
      <ol className="mt-3 grid gap-x-8 gap-y-1.5 text-[15px] sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item} className="flex gap-2">
            <span className="w-5 shrink-0 text-gray-400">{index + 1}.</span>
            <a
              href={`#${slugify(item)}`}
              className="rounded-sm text-gray-800 underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {item}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
