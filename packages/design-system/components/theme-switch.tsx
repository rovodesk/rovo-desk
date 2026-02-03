

import { MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "../context/theme";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export function runThemeTransition(
  next: "light" | "dark" | "system",
  setTheme: (theme: "light" | "dark" | "system") => void,
) {
  if (!document.startViewTransition) {
    setTheme(next);
    return;
  }

  // We use the click X-coordinate to decide if we wipe from left or right
  // Or simply default to an inset wipe
  const transition = document.startViewTransition(async () => {
    setTheme(next);
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        // This creates a vertical wipe reveal from top to bottom
        // You can change 'inset(0 0 100% 0)' to 'inset(0 100% 0 0)' for left-to-right
        clipPath: [
          "inset(0 0 0 100%)", 
          "inset(0 0 0 0%)"
        ],
        // Replace the clipPath array for a diagonal reveal
        // clipPath: [
        //   "polygon(0 0, 0 0, 0 0, 0 0)",
        //   "polygon(0 0, 200% 0, 0 200%, 0 0)"
        // ]
        
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
}

export function ThemeSwitch({className}: {className?: string}) {
const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark"
    runThemeTransition(next, setTheme)
  }

  return (
  <Button
      variant="ghost"
      size="icon"
      className={cn("scale-95 rounded-full hover:bg-transparent!", className)}
      onClick={toggleTheme}>
      <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonStarIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
