import { createFileRoute } from "@tanstack/react-router";
import BlogsPage from "@/pages/blogs";

export const Route = createFileRoute("/blogs/")({
    component: BlogsPage,
});
