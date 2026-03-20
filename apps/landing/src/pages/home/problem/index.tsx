import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ChatSequence } from "@/components/chat-sequence";
import { Icons } from "@/components/icons";
import { OrbitingCircles } from "@/components/orbiting-circles";
import { TextGenerateEffect } from "@/components/text-generate";
import type { ProblemBlock } from "@/lib/componen-registry/types";
import { Highlighter } from "./highlighter";

type Props = {
    className?: string;
    data: ProblemBlock;
};

export default function ProblemSection({ className, data }: Props) {
    return (
        <section
            className={cn(
                "relative min-h-svh overflow-hidden border-t bg-black",
                "px-4 py-20 sm:px-6 sm:py-28",
                className
            )}
        >
            {/* Background gradient - Fixed bg-linear to bg-gradient */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black via-black/80 to-transparent" />
            {/* Container */}
            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-16">
                    <TextGenerateEffect words="Everything you need to scale faster. Explore the features that make RovoDesk the perfect choice for your business." />
                    <div className="mt-8">
                        <p className="leading-relaxed">
                            The{" "}
                            <Highlighter action="underline" highlightColor="#FF9800">
                                Magic UI Highlighter
                            </Highlighter>{" "}
                            makes important{" "}
                            <Highlighter
                                action="highlight"
                                highlightColor="#00FFFF"
                                textColor="#000000"
                            >
                                text stand out
                            </Highlighter>{" "}
                            effortlessly.
                        </p>
                    </div>
                </div>

                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* LEFT: Visual (Orbiting Circles) */}
                    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
                        <OrbitingCircles iconSize={40} radius={80}>
                            <Icons.whatsapp />
                            <Icons.notion />
                            <Icons.openai />
                            <Icons.googleDrive />
                        </OrbitingCircles>

                        {/* Outer Circle */}
                        <OrbitingCircles iconSize={30} radius={160} reverse speed={2}>
                            <Icons.whatsapp />
                            <Icons.notion />
                            <Icons.openai />
                            <Icons.googleDrive />
                        </OrbitingCircles>
                    </div>

                    {/* RIGHT: Product (Chat) */}
                    <div className="relative">
                        {/* Glow */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_70%)]" />

                        {/* Chat Container */}
                        <div className={cn("relative overflow-hidden")}>
                            <ChatSequence />
                        </div>

                        {/* Bottom fade */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}
