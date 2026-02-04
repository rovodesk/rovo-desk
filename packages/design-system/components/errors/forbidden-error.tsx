import { Button } from "../ui/button";

type ForbiddenErrorProps = React.HTMLAttributes<HTMLDivElement> & {
	onGoBack?: () => void;
	onGoHome?: () => void;
};

export function ForbiddenError({
	onGoBack,
	onGoHome,
}: ForbiddenErrorProps) {

	return (
		<div className="h-svh">
			<div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
				<h1 className="font-bold text-[7rem] leading-tight">403</h1>
				<span className="font-medium">Access Forbidden</span>
				<p className="text-center text-muted-foreground">
					You don't have necessary permission <br />
					to view this resource.
				</p>
				<div className="mt-6 flex gap-4">
					<Button onClick={onGoBack} variant="outline">
						Go Back
					</Button>
					<Button onClick={onGoHome}>Back to Home</Button>
				</div>
			</div>
		</div>
	);
}