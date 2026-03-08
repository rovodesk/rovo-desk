import { createFileRoute } from "@tanstack/react-router";
import BlogPost from "@/pages/blogs/post";

export const Route = createFileRoute("/blogs/post/$slug")({
    loader: ({ params }) => {
        return { slug: params.slug };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { slug } = Route.useParams();
    return <BlogPost slug={slug} />;
}
