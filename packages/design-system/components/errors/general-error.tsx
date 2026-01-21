import React from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean;
  onGoBack?: () => void;
  onGoHome?: () => void;
};

export function GeneralError({
  className,
  minimal = false,
  onGoBack,
  onGoHome,
}: GeneralErrorProps) {
  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && (
          <h1 className="font-bold text-[7rem] leading-tight">500</h1>
        )}

        <span className="font-medium">
          Oops! Something went wrong {`:')`}
        </span>

        <p className="text-center text-muted-foreground">
          We apologize for the inconvenience. <br /> Please try again later.
        </p>

        {!minimal && (onGoBack || onGoHome) && (
          <div className="mt-6 flex gap-4">
            {onGoBack && (
              <Button onClick={onGoBack} variant="outline">
                Go Back
              </Button>
            )}

            {onGoHome && (
              <Button onClick={onGoHome}>Back to Home</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
