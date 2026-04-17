import { Link } from "@tanstack/react-router";
import { usePostHog } from "@zero-heads-lab/analytics/client/hooks";
import {
	COOKIE_CONSENT_ACCEPTED_EVENT,
	COOKIE_CONSENT_DECLINED_EVENT,
} from "@zero-heads-lab/analytics/events";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@zero-heads-lab/design-system/components/ui/card";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { getCookie, noop, setCookie } from "@zero-heads-lab/shared/utils";
import { Cookie } from "lucide-react";
import * as React from "react";

interface CookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "small" | "mini";
	onAcceptCallback?: () => void;
	onDeclineCallback?: () => void;
	description?: string;
	cookiePolicyHref?: string;
}

const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
	(
		{
			variant = "default",
			onAcceptCallback = () => noop,
			onDeclineCallback = () => noop,
			className,
			description = "We use cookies to ensure you get the best experience on our website. For more information on how we use cookies, please see our cookie policy.",
			cookiePolicyHref = "/privacy/cookies",
			...props
		},
		ref
	) => {
		const [isOpen, setIsOpen] = React.useState(false);
		const [hide, setHide] = React.useState(false);

		const posthog = usePostHog();

		// Save cookie consent choice in a cookie that expires in 1 year
		const setCookieConsent = (value: "true" | "false") => {
			setCookie("cookieConsent", value, 60 * 60 * 24 * 365); // 1 year
		};

		// biome-ignore lint/correctness/useExhaustiveDependencies: Setting cookie consent is a side effect that doesn't need to be memoized with posthog or callbacks, and including them would cause unnecessary re-renders.
		const handleAccept = React.useCallback(() => {
			setCookieConsent("true"); // <-- store consent
			setIsOpen(false);
			// Post Hog cookie consent handling
			posthog.opt_in_capturing();
			// Analyze the accept event with PostHog
			posthog.capture(COOKIE_CONSENT_ACCEPTED_EVENT, {
				source: `cookie_consent_${variant}`,
			});

			setTimeout(() => {
				setHide(true);
			}, 700);
			onAcceptCallback();
		}, [onAcceptCallback, posthog]);

		// biome-ignore lint/correctness/useExhaustiveDependencies: Setting cookie consent is a side effect that doesn't need to be memoized with posthog or callbacks, and including them would cause unnecessary re-renders.
		const handleDecline = React.useCallback(() => {
			setCookieConsent("false"); // <-- store decline
			setIsOpen(false);
			posthog.opt_out_capturing();
			// Analyze the decline event with PostHog
			posthog.capture(COOKIE_CONSENT_DECLINED_EVENT, {
				source: `cookie_consent_${variant}`,
			});

			setTimeout(() => {
				setHide(true);
			}, 700);
			onDeclineCallback();
		}, [onDeclineCallback, posthog]);

		// Check cookie consent on mount
		React.useEffect(() => {
			try {
				const consent = getCookie("cookieConsent");

				if (consent === "true") {
					posthog.opt_in_capturing();
				} else if (consent === "false") {
					posthog.opt_out_capturing();
				}

				if (consent === "true" || consent === "false") {
					setIsOpen(false);

					setTimeout(() => {
						setHide(true);
					}, 700);
				} else {
					setIsOpen(true);
				}
			} catch {
				setIsOpen(false);
				setTimeout(() => {
					setHide(true);
				}, 700);
			}
		}, [posthog]);

		if (hide) return null;

		const containerClasses = cn(
			"fixed z-50 transition-all duration-700",
			isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
			className
		);

		const commonWrapperProps = {
			ref,
			role: "region",
			"aria-label": "Cookie consent banner",
			className: cn(
				containerClasses,
				variant === "mini"
					? "right-0 bottom-4 left-0 w-full sm:left-4 sm:max-w-4xl"
					: "right-0 bottom-0 left-0 w-full sm:bottom-4 sm:left-4 sm:max-w-2xl"
			),
			...props,
		};

		if (variant === "default") {
			return (
				<div {...commonWrapperProps} id="cookie-consent-default">
					<Card
						className={cn(
							"m-3 overflow-hidden rounded-xl",
							"border border-white/10 bg-[#0B0B0C]/80 backdrop-blur-xl",
							"shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
						)}
					>
						<CardHeader className="flex flex-row items-center justify-between pb-3">
							<CardTitle className="font-medium text-sm text-white">
								We use cookies
							</CardTitle>

							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
								<Cookie className="h-4 w-4 text-white/70" />
							</div>
						</CardHeader>

						<CardContent className="space-y-3 pb-4">
							<CardDescription className="text-sm text-white/60 leading-relaxed">
								{description}
							</CardDescription>

							<p className="text-white/40 text-xs">
								By clicking <span className="text-white">Accept</span>, you
								agree to our use of cookies.
							</p>

							<Link
								className="text-white/50 text-xs underline underline-offset-4 hover:text-white"
								to={cookiePolicyHref}
							>
								Learn more
							</Link>
						</CardContent>

						<CardFooter className="flex gap-2 pt-0">
							<Button
								className="flex-1 text-white/60 hover:bg-white/10"
								onClick={handleDecline}
								variant="ghost"
							>
								Decline
							</Button>

							<Button
								className={cn(
									"flex-1",
									"bg-white text-black hover:bg-white/90"
								)}
								onClick={handleAccept}
							>
								Accept
							</Button>
						</CardFooter>
					</Card>
				</div>
			);
		}

		if (variant === "small") {
			return (
				<div {...commonWrapperProps} id="cookie-consent-small">
					<Card
						className={cn(
							"m-3 rounded-xl border border-white/10 bg-[#0B0B0C]/80 backdrop-blur-xl",
							"shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
						)}
					>
						<CardContent className="space-y-3 px-4 py-4">
							<div className="flex items-center justify-between">
								<p className="font-medium text-sm text-white">We use cookies</p>
								<Cookie className="h-4 w-4 text-white/50" />
							</div>

							<p className="text-sm text-white/60 leading-relaxed">
								{description}
							</p>

							<div className="flex gap-2 pt-2">
								<Button
									className="flex-1 rounded-full text-white/60 hover:bg-white/10"
									onClick={handleDecline}
									size="sm"
									variant="ghost"
								>
									Decline
								</Button>

								<Button
									className="flex-1 rounded-full bg-white text-black hover:bg-white/90"
									onClick={handleAccept}
									size="sm"
								>
									Accept
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			);
		}

		if (variant === "mini") {
			return (
				<div {...commonWrapperProps} id="cookie-consent-mini">
					<Card
						className={cn(
							"mx-3 rounded-xl border border-white/10 bg-[#0B0B0C]/80 backdrop-blur-xl",
							"shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
						)}
					>
						<CardContent className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
							<p className="flex-1 text-white/60 text-xs leading-relaxed sm:text-sm">
								{description}
							</p>

							<div className="flex gap-2">
								<Button
									className="h-8 text-white/60 text-xs hover:bg-white/10"
									onClick={handleDecline}
									size="sm"
									variant="ghost"
								>
									Decline
								</Button>

								<Button
									className="h-8 bg-white text-black text-xs hover:bg-white/90"
									onClick={handleAccept}
									size="sm"
								>
									Accept
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			);
		}

		return null;
	}
);

CookieConsent.displayName = "CookieConsent";
export { CookieConsent };
export default CookieConsent;
