import type { Author } from "../data";

interface AuthorAvatarProps {
    author: Author;
    size?: "sm" | "md" | "lg";
}

const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
};

export function AuthorAvatar({ author, size = "md" }: AuthorAvatarProps) {
    return (
        <img
            alt={author.name}
            className={`${sizes[size]} rounded-full bg-muted object-cover`}
            src={author.avatar}
        />
    );
}
