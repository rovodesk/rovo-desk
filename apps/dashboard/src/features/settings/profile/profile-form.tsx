<<<<<<< HEAD
<<<<<<< HEAD


=======
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======

import { LastLoginBadge } from "@zero-heads-lab/auth/components/last-login-badge";

>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)

import { useSession } from "@zero-heads-lab/auth/hooks";
import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@zero-heads-lab/design-system/components/ui/dialog";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import {
	AtSignIcon,
	CheckCircle2Icon,
	GlobeIcon,
	PencilIcon,
	Trash2Icon,
	UploadIcon,
	UserIcon,
	XCircleIcon,
} from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";

const languages = [
	{ label: "English", value: "en" },
	{ label: "French", value: "fr" },
	{ label: "German", value: "de" },
	{ label: "Spanish", value: "es" },
	{ label: "Portuguese", value: "pt" },
	{ label: "Russian", value: "ru" },
	{ label: "Japanese", value: "ja" },
	{ label: "Korean", value: "ko" },
	{ label: "Chinese", value: "zh" },
];

const formSchema = z.object({
	name: z.string().min(2).max(30),
	email: z.email(),
	image: z.string(),
	dob: z.date(),
	language: z.string(),
	bio: z.string().max(160),
});

export function ProfileForm() {
	const { session, isLoading } = useSession();

	const form = useAppForm({
		defaultValues: {
			name: session?.user.name ?? "",
			email: session?.user.email ?? "",
			image: session?.user.image ?? "",
			bio: "",
			dob: new Date(),
			language: "en",
		},
		validators: { onSubmit: formSchema },
		onSubmit: ({ value }) => {
			toast.success("Settings updated successfully.", {
				description: (
					<pre className="max-h-64 overflow-auto text-xs">
						{JSON.stringify(value, null, 2)}
					</pre>
				),
			});
		},
	});

	useEffect(() => {
		if (session?.user) {
			form.reset({
				name: session.user.name ?? "",
				email: session.user.email ?? "",
				image: session.user.image ?? "",
				bio: "",
				dob: new Date(),
				language: "en",
			});
		}
	}, [session, form.reset]);

	if (isLoading) return <ProfileSkeleton />;

	return (
		<form
			className="mx-auto max-w-5xl"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<div className="space-y-8">
					{/* SECTION 1: HEADER & AVATAR */}
					<div className="flex flex-col gap-6 border-border border-b pb-8 md:flex-row md:items-start md:justify-between">
						<div className="flex items-start gap-6">
							<div className="group relative">
								<img
									alt="Profile"
									className="size-24 rounded-xl border-2 border-muted bg-muted object-cover shadow-sm transition-all group-hover:opacity-80"
									src={session?.user.image ?? ""}
								/>
								<div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
									<UploadIcon className="size-6 text-white drop-shadow-md" />
								</div>
							</div>
							<div className="space-y-1.5 pt-1">
								<h2 className="font-semibold text-xl tracking-tight">
									{session?.user.name || "User Profile"}
								</h2>
								<div className="flex items-center gap-2 text-muted-foreground text-sm">
									<span>{session?.user.email}</span>
									<LastLoginBadge />
								</div>
								<div className="flex gap-2 pt-2">
									<Button className="h-8 text-xs" size="sm" variant="outline">
										Change Avatar
									</Button>
									<Button
										className="h-8 text-destructive text-xs hover:text-destructive"
										size="sm"
										variant="ghost"
									>
										<Trash2Icon className="mr-2 size-3" />
										Remove
									</Button>
								</div>
							</div>
						</div>
					</div>
<<<<<<< HEAD

					{/* SECTION 2: FORM CONTENT */}
					<div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
						{/* LEFT COLUMN: PUBLIC PROFILE */}
						<div className="space-y-6 lg:col-span-2">
							<div>
								<h3 className="mb-4 font-medium text-lg">Public Profile</h3>
								<div className="grid gap-6">
									<form.AppField
										children={(field) => (
											<field.TextField
												icon={<UserIcon className="size-4" />}
												label="Display Name"
												placeholder="e.g. Jane Doe"
											/>
										)}
										name="name"
									/>

									<form.AppField
										children={(field) => (
											<field.TextareaField
												className="min-h-[120px] resize-none"
												description="Brief description for your profile. URLs are hyperlinked."
												label="Bio"
												maxLength={160}
												placeholder="I'm a software engineer based in..."
											/>
										)}
										name="bio"
									/>

									<form.AppField
										children={(field) => (
											<field.SelectField
												icon={<GlobeIcon className="size-4" />}
												label="Interface Language"
												options={languages}
											/>
										)}
										name="language"
									/>
								</div>
							</div>
						</div>

						{/* RIGHT COLUMN: ACCOUNT & SECURITY */}
						<div className="space-y-8">
							<div>
								<h3 className="mb-4 font-medium text-lg">Account Details</h3>
								<div className="flex flex-col gap-6 rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
									{/* Email Field with Verification Status embedded cleanly */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<Label className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
												Email Address
											</Label>
											{session?.user.emailVerified ? (
												<span className="flex items-center gap-1 font-medium text-[10px] text-emerald-500 uppercase tracking-wider">
													<CheckCircle2Icon className="size-3" /> Verified
												</span>
											) : (
												<span className="flex items-center gap-1 font-medium text-[10px] text-amber-500 uppercase tracking-wider">
													<XCircleIcon className="size-3" /> Unverified
												</span>
											)}
										</div>

<<<<<<< HEAD
=======

					{/* SECTION 2: FORM CONTENT */}
					<div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
						{/* LEFT COLUMN: PUBLIC PROFILE */}
						<div className="space-y-6 lg:col-span-2">
							<div>
								<h3 className="mb-4 font-medium text-lg">Public Profile</h3>
								<div className="grid gap-6">
									<form.AppField
										children={(field) => (
											<field.TextField
												icon={<UserIcon className="size-4" />}
												label="Display Name"
												placeholder="e.g. Jane Doe"
											/>
										)}
										name="name"
									/>

									<form.AppField
										children={(field) => (
											<field.TextareaField
												className="min-h-[120px] resize-none"
												description="Brief description for your profile. URLs are hyperlinked."
												label="Bio"
												maxLength={160}
												placeholder="I'm a software engineer based in..."
											/>
										)}
										name="bio"
									/>

									<form.AppField
										children={(field) => (
											<field.SelectField
												icon={<GlobeIcon className="size-4" />}
												label="Interface Language"
												options={languages}
											/>
										)}
										name="language"
									/>
								</div>
							</div>
						</div>

						{/* RIGHT COLUMN: ACCOUNT & SECURITY */}
						<div className="space-y-8">
							<div>
								<h3 className="mb-4 font-medium text-lg">Account Details</h3>
								<div className="flex flex-col gap-6 rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
									{/* Email Field with Verification Status embedded cleanly */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<Label className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
												Email Address
											</Label>
											{session?.user.emailVerified ? (
												<span className="flex items-center gap-1 font-medium text-[10px] text-emerald-500 uppercase tracking-wider">
													<CheckCircle2Icon className="size-3" /> Verified
												</span>
											) : (
												<span className="flex items-center gap-1 font-medium text-[10px] text-amber-500 uppercase tracking-wider">
													<XCircleIcon className="size-3" /> Unverified
												</span>
											)}
										</div>

>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
										<form.AppField
											children={(field) => (
												<field.TextField
													className="bg-muted/50"
													disabled
													icon={
														<AtSignIcon className="size-4 text-muted-foreground" />
													}
													value={session?.user.email}
												/>
											)}
											name="email"
<<<<<<< HEAD
=======
								<form.AppField
									children={(field) => (
										<field.TextField
											description="Primary email for notifications and security."
											disabled
											icon={
												<AtSignIcon className="size-4 text-muted-foreground" />
											}
											label="Email Address"
											value={session?.user.email}
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
										/>

										<div className="flex justify-end">
											<UpdateEmailDialog />
										</div>
									</div>

									<div className="h-px bg-border" />

									<form.AppField
										children={(field) => (
											<field.DatePickerField label="Date of birth" />
										)}
										name="dob"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* SECTION 3: DANGER ZONE */}
					<div className="mt-8 pt-8">
						<div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-6 md:flex-row md:items-center md:justify-between">
							<div className="space-y-1">
								<h3 className="font-semibold text-base text-destructive">
									Danger Zone
								</h3>
								<p className="text-muted-foreground text-sm">
									Irreversible actions. Be careful with these settings.
								</p>
							</div>

							<Button
								className="bg-destructive hover:bg-destructive/90"
								variant="destructive"
							>
								Delete Account
							</Button>
						</div>
					</div>

					{/* FOOTER */}
					<div className="flex items-center justify-between border-t py-6">
						<p className="text-muted-foreground text-xs">
							Last updated on {session?.user.updatedAt.toLocaleDateString()}
						</p>
						<form.SubmitButton className="min-w-[120px]">
							Save Changes
						</form.SubmitButton>
					</div>
				</div>
			</form.AppForm>
		</form>
	);
}

function UpdateEmailDialog() {
	const [open, setOpen] = useState(false);

	const addEmailForm = useAppForm({
		defaultValues: { email: "" },
		validators: { onSubmit: z.object({ email: z.string().email() }) },
		onSubmit: () => {
			toast.promise(new Promise((res) => setTimeout(res, 1000)), {
				loading: "Adding email...",
				success: "Verification email sent!",
				error: "Could not add email.",
			});
			setOpen(false);
		},
	});

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button
					className="h-auto p-0 text-primary text-xs underline-offset-4 hover:underline"
					size="sm"
					variant="link"
				>
					<PencilIcon className="mr-1.5 size-3" /> Change email address
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update email</DialogTitle>
					<DialogDescription>
						Enter your new email address. We will send a verification link.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<addEmailForm.AppField
						children={(field) => (
							<field.TextField
								autoFocus
								icon={<AtSignIcon className="size-4" />}
								placeholder="new.email@example.com"
							/>
						)}
						name="email"
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost">Cancel</Button>
					</DialogClose>
					<Button onClick={() => addEmailForm.handleSubmit()}>
						Send Verification
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function ProfileSkeleton() {
	return (
		<div className="mx-auto max-w-5xl space-y-10">
			<div className="flex items-center gap-6 border-b pb-8">
				<Skeleton className="size-24 rounded-xl" />
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-32" />
				</div>
			</div>
			<div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
				<div className="col-span-2 space-y-8">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
				<div className="space-y-8">
					<Skeleton className="h-64 w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
}
