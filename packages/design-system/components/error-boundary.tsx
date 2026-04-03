import { Button } from "./ui/button";
import React from "react";

type AppErrorBoundaryProps = {
	children: React.ReactNode;
	/**
	 * Optional custom fallback UI
	 */
	fallback?: React.ReactNode;
	/**
	 * Optional error reporting hook (Sentry, Datadog, custom logger, etc.)
	 */
	onError?: (error: Error, info: React.ErrorInfo) => void;
};

type AppErrorBoundaryState = {
	error: Error | null;
};

export class AppErrorBoundary extends React.Component<
	AppErrorBoundaryProps,
	AppErrorBoundaryState
> {
	state: AppErrorBoundaryState = {
		error: null,
	};

	static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
		// Normalize non-Error throws (e.g. `throw "oops"`)
		if (error instanceof Error) {
			return { error };
		}

		return {
			error: new Error("An unknown error occurred"),
		};
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		// Always log locally (useful in dev + prod)
		console.error("AppErrorBoundary caught an error:", error);
		console.error("Component stack:", info.componentStack);

		// Optional external logging
		this.props.onError?.(error, info);
	}

	resetErrorBoundary = () => {
		this.setState({ error: null });
	};

	render() {
		const { error } = this.state;
		const { fallback, children } = this.props;

		if (error) {
			if (fallback) {
				return <>{fallback}</>;
			}

			return (
				<div
					role="alert"
					style={{
						padding: "1rem",
						border: "1px solid #e5e7eb",
						borderRadius: 6,
						background: "#fafafa",
					}}
				>
					<h2>Something went wrong</h2>

					{/* User-safe message */}
					<p>{error.message || "Unexpected application error."}</p>

					{/* Retry */}
					<Button onClick={this.resetErrorBoundary}>Try again</Button>
				</div>
			);
		}

		return <>{children}</>
	}
}
