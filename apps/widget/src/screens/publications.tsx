import { Megaphone, ChevronRight } from "lucide-react";

export function PublicationsScreen() {
    const posts = [
        {
            id: 1,
            title: "New AI assistant is live 🤖",
            description: "Get instant answers and smarter support.",
            time: "2d ago",
        },
        {
            id: 2,
            title: "Improved dashboard performance",
            description: "Pages now load 2x faster.",
            time: "5d ago",
        },
        {
            id: 3,
            title: "Introducing dark mode 🌙",
            description: "Switch themes anytime from settings.",
            time: "1w ago",
        },
    ];

    return (
        <div className="relative flex h-full flex-col overflow-hidden text-white">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_40%)]" />
            <div className="absolute inset-0 bg-black" />

            <div className="relative z-10 flex h-full flex-col">
                {/* Header */}
                <div className="px-5 pt-5 pb-4">
                    <h1 className="text-lg font-semibold">Updates</h1>
                    <p className="text-sm text-white/60">
                        Product news & announcements
                    </p>
                </div>

                {/* Feed */}
                <div className="flex-1 space-y-3 overflow-y-auto px-3 pb-6">
                    {posts.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-white/60">
                            <Megaphone className="mb-3 h-6 w-6 opacity-60" />
                            <p>No updates yet</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.id}
                                className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:bg-white/10"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium leading-snug">
                                            {post.title}
                                        </p>
                                        <p className="mt-1 text-sm text-white/60 line-clamp-2">
                                            {post.description}
                                        </p>
                                        <span className="mt-2 block text-xs text-white/40">
                                            {post.time}
                                        </span>
                                    </div>

                                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-white/40 group-hover:text-white" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}