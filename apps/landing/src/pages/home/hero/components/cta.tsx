import { useFeatureFlagEnabled } from "@zero-heads-lab/analytics/client/hooks";
import { WAITLIST_FLAG } from "@zero-heads-lab/analytics/flags";
import {
    InputGroup,
    InputGroupButton,
    InputGroupInput,
} from "@zero-heads-lab/design-system/components/ui/input-group";
import { ArrowRightCircleIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";

export const CTA = ({
    ctas,
}: {
    ctas: {
        label: string;
        link: string;
        id?: string;
        type: "primary" | "secondary";
    }[];
}) => {
    // Always call the hook but pass a safe value if no flag is present
    const isEnabled = useFeatureFlagEnabled(WAITLIST_FLAG ?? "");

    // Pick Last 2 CTAs
    ctas = ctas.slice(-2);

    if (!isEnabled)
        return (
            <div className="flex max-w-md flex-col items-center justify-center space-y-6">
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex w-full items-center justify-center gap-6 sm:mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {/* Primary CTA (White Button) */}
                    <button className="rounded-lg bg-white px-4 py-3 font-bold text-black transition-all hover:scale-102 hover:border-blue-600 hover:bg-gray-600/40 hover:text-white">
                        {ctas.find((cta) => cta.type === "primary")?.label}
                    </button>

                    {/* Secondary CTA */}
                    <button className="group inline-flex items-center gap-2 font-medium text-white/80 transition-all hover:text-white">
                        {ctas.find((cta) => cta.type === "secondary")?.label}

                        <motion.span
                            animate={{ x: 4, opacity: 1 }}
                            className="inline-flex"
                            initial={{ x: 0, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 }}
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </motion.span>
                    </button>
                </motion.div>
            </div>
        );

    return (
        <div className="flex w-md flex-col items-center space-y-4 text-start">
            <motion.form
                className="mt-8 flex w-full flex-col gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileInView={{ opacity: 1, y: 0 }}
            >
                {/* 2. THE INPUT GROUP */}
                <InputGroup className="relative h-12 w-full cursor-none! rounded-xl border border-white/10! bg-[#0B0B0C]/40! p-2 backdrop-blur-xs transition-colors group-hover:border-white/20! group-hover:bg-[#0B0B0C]/80!">
                    <InputGroupInput
                        className="cursor-none border-none bg-transparent placeholder:text-white/30 focus-visible:ring-0"
                        placeholder="Enter your email"
                        type="email"
                    />

                    <InputGroupButton
                        className="group/btn relative overflow-hidden bg-transparent! hover:bg-transparent!"
                        type="submit"
                    >
                        <motion.div
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            whileHover={{ x: 3 }}
                        >
                            <ArrowRightCircleIcon className="size-6 text-neutral-300 transition-transform duration-300 ease-in-out" />
                        </motion.div>

                        {/* Subtle button splash on hover */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover/btn:opacity-100" />
                    </InputGroupButton>
                </InputGroup>
            </motion.form>
            <p className="text-neutral-500 text-sm">
                <span className="font-semibold text-neutral-200">1,200+ teams</span> are
                already on the waitlist.
            </p>
        </div>
    );
};
