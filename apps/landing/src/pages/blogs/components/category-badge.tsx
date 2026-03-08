import type { Category } from "../data";

const categoryColors: Record<Category, string> = {
    Engineering: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    Product: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    AI: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    Guides: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Company: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

interface CategoryBadgeProps {
    category: Category;
    interactive?: boolean;
    active?: boolean;
    onClick?: () => void;
}

export function CategoryBadge({
    category,
    interactive,
    active,
    onClick,
}: CategoryBadgeProps) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200";
    const colors = categoryColors[category];

    if (interactive) {
        return (
            <button
                className={`${base} ${active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                onClick={onClick}
            >
                {category}
            </button>
        );
    }

    return <span className={`${base} ${colors}`}>{category}</span>;
}
