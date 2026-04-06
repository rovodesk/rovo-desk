import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/(auth)/login")({
	validateSearch: (search?: Record<string, unknown>) => ({
		error: typeof search?.error === "string" ? search.error : undefined,
	}),
	component: LoginPage,
});

function LoginPage() {
	const { socialLogin, isLoading, isAuthenticated, user } = useAuth();
	const { error } = useSearch({ from: "/(auth)/login" });
	const [isRedirecting, setIsRedirecting] = useState(false);

	const handleLogin = () => {
		try {
			setIsRedirecting(true);
			socialLogin({ provider: "google" });
		} catch (err) {
			console.error("Login failed to initiate", err);
		} finally {
			setIsRedirecting(false);
		}
	};

	if (isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
				<div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
					<h1 className="font-semibold text-2xl text-zinc-900">
						You&apos;re already signed in
					</h1>
					<p className="mt-2 text-sm text-zinc-600">
						Signed in as <span className="font-medium">{user?.email}</span>
					</p>

					<a
						className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 font-medium text-sm text-white transition hover:opacity-90"
						href="/"
					>
						Go to dashboard
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-zinc-50">
			{/* Left panel */}
			<div className="hidden w-1/2 flex-col justify-between bg-black p-10 text-white lg:flex">
				<div>
					<div className="inline-flex items-center rounded-full border border-white/15 px-3 py-1 font-medium text-white/80 text-xs">
						RoboDesk
					</div>

					<h1 className="mt-8 max-w-md font-semibold text-4xl leading-tight">
						Run support, operations, and customer workflows from one desk.
					</h1>

					<p className="mt-4 max-w-md text-sm text-zinc-300 leading-6">
						Secure authentication for your dashboard, admin panel, and internal
						tooling — powered by your centralized auth gateway.
					</p>
				</div>

				<div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
					<p className="text-sm text-zinc-200">
						“One auth system for every workspace. Clean, secure, and easy to
						manage.”
					</p>
					<p className="mt-3 text-xs text-zinc-400">RoboDesk Platform</p>
				</div>
			</div>

			{/* Right panel */}
			<div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
				<div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
					<div className="mb-8">
						<p className="font-medium text-sm text-zinc-500">Welcome back</p>
						<h2 className="mt-2 font-semibold text-3xl text-zinc-900 tracking-tight">
							Sign in to RoboDesk
						</h2>
						<p className="mt-3 text-sm text-zinc-600 leading-6">
							Use your organization account to continue securely.
						</p>
					</div>

					{error ? (
						<div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
							{decodeURIComponent(error)}
						</div>
					) : null}

					<button
						className="inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 font-medium text-sm text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
						disabled={isRedirecting || isLoading}
						onClick={handleLogin}
						type="button"
					>
						{isRedirecting || isLoading
							? "Redirecting..."
							: "Continue to sign in"}
					</button>

					<div className="mt-6 text-center text-xs text-zinc-500 leading-5">
						By continuing, you agree to your organization’s authentication and
						access policies.
					</div>
				</div>
			</div>
		</div>
	);
}
