import { useUser } from "@zero-heads-lab/auth/hooks/use-user";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";

export default function Welcome() {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-lg space-y-4 p-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>
        );
    }

    if (!user) return null;

    // Get initials safely
    const initials =
        user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "??";

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-1 shadow-2xl backdrop-blur-xl dark:bg-zinc-950/80"
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="p-6">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm transition-transform hover:scale-105 dark:border-zinc-800">
                            <AvatarImage className="object-cover" src={user.image || ""} />
                            <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 font-medium text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 dark:border-zinc-900" />
                    </div>

                    <div className="flex flex-col">
                        <h2 className="font-semibold text-xl text-zinc-900 tracking-tight dark:text-zinc-100">
                            Welcome back, {user.name.split(" ")[0]}
                        </h2>
                        <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                            <span className="capitalize">{user.role} Account</span>
                        </div>
                    </div>
                </div>

                {/* Info Grid - Replaces the Raw JSON */}
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoCard
                        icon={<Mail className="h-4 w-4" />}
                        label="Email Address"
                        value={user.email}
                    />
                    <InfoCard
                        icon={<UserIcon className="h-4 w-4" />}
                        label="Namme"
                        value={user.name || "Not set"}
                    />
                </div>

                {/* Subtle Footer/ID section */}
                <div className="mt-6 border-zinc-100 border-t pt-4 dark:border-zinc-800/50">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-widest">
                        <span>Organization ID</span>
                        <span className="font-mono">{user.id.slice(0, 8)}...</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function InfoCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                {icon}
                <span className="font-medium text-[11px] uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <p className="truncate font-medium text-sm text-zinc-900 dark:text-zinc-200">
                {value}
            </p>
        </div>
    );
}
