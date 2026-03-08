import postAiSupport from "@/pages/blogs/assets/post-ai-support.jpg";
import postAutomation from "@/pages/blogs/assets/post-automation.jpg";

const imageMap: Record<string, string> = {
    "/post-ai-support.jpg": postAiSupport,
    "/post-automation.jpg": postAutomation,
};

export function resolveImage(path: string) {
    return imageMap[path] || path;
}