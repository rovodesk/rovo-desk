import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Linkedin, Link as LinkIcon, Twitter } from "lucide-react";

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const url = `${window.location.origin}/blog/${slug}`;

    const copyLink = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
    };

    return (
        <div className="flex items-center gap-2">
            <span className="mr-1 text-muted-foreground text-xs">Share</span>
            <a
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                rel="noopener noreferrer"
                target="_blank"
            >
                <Twitter className="h-4 w-4" />
            </a>
            <a
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                rel="noopener noreferrer"
                target="_blank"
            >
                <Linkedin className="h-4 w-4" />
            </a>
            <button
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={copyLink}
            >
                <LinkIcon className="h-4 w-4" />
            </button>
        </div>
    );
}
