import { useEffect, useRef } from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

type NavigationProgressProps = {
  isNavigating: boolean;
};

export function NavigationProgress({ isNavigating }: NavigationProgressProps) {
  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (isNavigating) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [isNavigating]);

  return (
    <LoadingBar
      color="var(--muted-foreground)"
      height={2}
      ref={ref}
      shadow={true}
    />
  );
}
