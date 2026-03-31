import { QueryClientProvider as ReactQueryProvider } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export const QueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const queryClient = router.options.context.queryClient;

  return (
    <ReactQueryProvider client={queryClient}>{children}</ReactQueryProvider>
  );
};
