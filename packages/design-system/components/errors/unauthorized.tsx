import { Button } from "../ui/button";

type UnauthorizedErrorProps = {
	onGoBack?: () => void;
	onGoHome?: () => void;
};

export function UnauthorisedError({
	onGoBack,
	onGoHome,
}: UnauthorizedErrorProps) {
	return (
		<div className="h-svh">
			<div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
				<h1 className="font-bold text-[7rem] leading-tight">401</h1>
				<span className="font-medium">Unauthorized Access</span>
				<p className="text-center text-muted-foreground">
					Please log in with the appropriate credentials <br /> to access this
					resource.
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
