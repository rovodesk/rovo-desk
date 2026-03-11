import { SignOutDialog } from "@zero-heads-lab/auth/components/sign-out-dialog";
import { useUser } from "@zero-heads-lab/auth/hooks/use-user";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";

export type HeaderProps = React.HTMLAttributes<HTMLElement> & {
    headerLeftContent?: React.ReactNode;
    headerRightContent?: React.ReactNode;
};

export function Header({
    className,
    headerLeftContent,
    headerRightContent,
    ...props
}: HeaderProps) {
    const { user } = useUser();
    const [signOutOpen, setSignOutOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll effect for that "floating" look when moving down the page
    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!user) return null;

    return (
        <>
            <header
                className={cn(
                    "sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between px-6 transition-all duration-200",
                    isScrolled
                        ? "border-zinc-200 border-b bg-black/70 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/70"
                        : "bg-transparent",
                    className
                )}
                {...props}
            >
                {/* --- Left Section --- */}
                <div className="flex items-center gap-4">
                    <DynamicBreadcrumb />

                    {headerLeftContent && (
                        <div className="ml-2 flex items-center gap-4">
                            {headerLeftContent}
                        </div>
                    )}
                </div>

                {/* --- Right Section --- */}
                <div className="flex items-center gap-3">
                    {headerRightContent && (
                        <div className="flex items-center gap-3">{headerRightContent}</div>
                    )}

                    {/* Default Profile & Logout Bundle */}
                    <div className="flex items-center gap-3 pl-2">
                        <div className="hidden flex-col items-end sm:flex">
                            <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                                {user.name}
                            </span>
                            <span className="font-medium text-[10px] text-zinc-500 uppercase tracking-tighter">
                                {user.role}
                            </span>
                        </div>

                        <Avatar className="h-8 w-8 ring-1 ring-zinc-200 dark:ring-zinc-800">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback className="bg-zinc-100 text-[10px]">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>

                        <Button
                            className="h-8 w-8 text-zinc-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                            onClick={() => setSignOutOpen(true)}
                            size="icon"
                            variant="ghost"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <SignOutDialog onOpenChange={setSignOutOpen} open={signOutOpen} />
        </>
    );
}
