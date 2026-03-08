import { useEffect, useState } from "react";

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [items, setItems] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const headings = doc.querySelectorAll("h2, h3");
        const tocItems: TOCItem[] = [];
        headings.forEach((h) => {
            const id = h.getAttribute("id");
            if (id) {
                tocItems.push({
                    id,
                    text: h.textContent || "",
                    level: h.tagName === "H2" ? 2 : 3,
                });
            }
        });
        setItems(tocItems);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-80px 0px -80% 0px" }
        );

        items.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [items]);

    if (items.length === 0) return null;

    return (
        <nav className="space-y-1">
            <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                On this page
            </p>
            {items.map((item) => (
                <a
                    className={`block text-sm transition-colors duration-200 ${item.level === 3 ? "pl-4" : ""
                        } ${activeId === item.id
                            ? "font-medium text-accent"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                    href={`#${item.id}`}
                    key={item.id}
                    onClick={(e) => {
                        e.preventDefault();
                        document
                            .getElementById(item.id)
                            ?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    {item.text}
                </a>
            ))}
        </nav>
    );
}
