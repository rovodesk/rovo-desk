export const TransactionalEmailTemplates = {
	AccountDeleteVerifiactionTemplate: () =>
		import("./accound-delete-verification"),
	AccountLinkingTemplate: () => import("./account-linking"),
	ChangeEmailConfirmationTemplate: () => import("./change-email-confirmation"),
	EmailVerificationLinkTemplate: () => import("./email-verification"),
	LoginAlertTemplate: () => import("./login-alert"),
	MagicLinkTemplate: () => import("./magic-link"),
	UserWelcomeTemplate: () => import("./welcome"),
	WorkspaceInvitationTemplate: () => import("./workspace-invitation"),
};

export async function loadTransactionalTemplate<
	T extends keyof typeof TransactionalEmailTemplates,
	// biome-ignore lint/suspicious/noExplicitAny: Return type is dynamic based on the template, and will be used in a runtime with no type support
>(template: T): Promise<any> {
	const mod = await TransactionalEmailTemplates[template]();
	return mod.default;
}
