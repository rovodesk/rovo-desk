import { useQuery } from "@tanstack/react-query";
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
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import {
	AtSignIcon,
	CheckCircle2Icon,
	PencilIcon,
	PhoneIcon,
	Trash2Icon,
	UploadIcon,
	XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { authQueries } from "@/lib/queries/auth.queries";

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
	phone: z.string(),
});

export function ProfileForm() {
	const { data: session, isLoading } = useQuery(authQueries.session());

	const form = useAppForm({
		defaultValues: {
			name: session?.user.name ?? "",
			email: session?.user.email ?? "",
			image: session?.user.image ?? "",
			bio: "",
			dob: new Date(),
			language: "en",
			phone: "",
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
				phone: "",
			});
		}
	}, [session, form.reset]);

	if (isLoading) return <ProfileSkeleton />;

	return (
		<form
			className="max-w-4xl"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<div className="space-y-10">
					<div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
						{/* COLUMN 1: IDENTITY */}
						<div className="space-y-6">
							{/* Avatar Section */}
							<div className="flex items-center gap-5">
								<div className="group relative">
									<img
										alt="Profile"
										className="size-20 rounded-md border-2 border-accent object-cover shadow-sm transition-opacity group-hover:opacity-80"
										src={session?.user.image ?? ""}
									/>
									<div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
										<UploadIcon className="size-5 text-white" />
									</div>
								</div>
								<div className="flex flex-col gap-1.5">
									<p className="font-medium text-sm">Profile Picture</p>
									<div className="flex gap-2">
										<Button
											className="h-10 px-3"
											size="sm"
											variant="destructive"
										>
											<Trash2Icon className="size-4" />
											Remove
										</Button>
									</div>
								</div>
							</div>

							<form.AppField
								children={(field) => (
									<field.TextField
										label="Display Name"
										placeholder="Your name"
									/>
								)}
								name="name"
							/>

							{/* Email Management with Absolute Status */}
							<div className="relative space-y-3">
								{/* Absolute Status Badge - Aligned with Label */}
								<div className="absolute top-0.5 right-0 flex items-center gap-3">
									{session?.user.emailVerified ? (
										<span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-bold text-[10px] text-emerald-500 uppercase tracking-wider">
											<CheckCircle2Icon className="size-3" />
											Verified
										</span>
									) : (
										<div className="flex items-center gap-2">
											<span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-bold text-[10px] text-amber-500 uppercase tracking-wider">
												<XCircleIcon className="size-3" />
												Unverified
											</span>
											<Button
												className="h-auto p-0 font-semibold text-[11px] text-primary underline-offset-4 hover:underline"
												variant="link"
											>
												Resend
											</Button>
										</div>
									)}
								</div>

								<form.AppField
									children={(field) => (
										<field.TextField
											description="Primary email for notifications and security."
											disabled
											label="Email Address"
											value={session?.user.email}
										/>
									)}
									name="email"
								/>

								<div className="flex justify-end">
									<UpdateEmailDialog />
								</div>

								<form.AppField
									children={(field) => (
										<field.TextField
											description="Primary phone number for notifications and security."
											icon={<PhoneIcon className="size-4" />}
											label="Phone Number"
										/>
									)}
									name="phone"
								/>
							</div>
						</div>

						{/* COLUMN 2: PREFERENCES */}
						<div className="space-y-6">
							<form.AppField
								children={(field) => (
									<field.DatePickerField
										description="Used for account recovery."
										label="Date of birth"
									/>
								)}
								name="dob"
							/>
							<form.AppField
								children={(field) => (
									<field.SelectField
										description="Set your preferred dashboard language."
										label="Interface Language"
										options={languages}
									/>
								)}
								name="language"
							/>
							<form.AppField
								children={(field) => (
									<field.TextareaField
										className="min-h-[120px] resize-none"
										label="Bio"
										maxLength={160}
										placeholder="A few words about yourself..."
									/>
								)}
								name="bio"
							/>
						</div>
					</div>

					{/* Danger Zone */}
					<div className="group flex items-center justify-between rounded-md border border-destructive border-dashed bg-destructive/10 p-4">
						<div className="flex flex-col gap-1">
							<h3 className="mb-1 font-semibold text-base">Danger Zone</h3>
							<p className="mb-6 text-muted-foreground text-sm">
								Be careful with these settings.
							</p>
						</div>

						<Button
							className="group-hover:bg-destructive/10"
							variant="destructive"
						>
							Delete Account
						</Button>
					</div>

					{/* Form Footer */}
					<div className="flex items-center justify-between border-border border-t pt-8">
						<p className="text-muted-foreground text-xs">
							Last updated: {session?.user.updatedAt.toLocaleDateString()}
						</p>
						<div className="flex gap-3">
							<form.SubmitButton className="px-10" size="default">
								Update Profile
							</form.SubmitButton>
						</div>
					</div>
				</div>
			</form.AppForm>
		</form>
	);
}

function UpdateEmailDialog() {
	const [open, setOpen] = useState(false);

	// Simplified specific form for the dialog
	const addEmailForm = useAppForm({
		defaultValues: { email: "" },
		validators: { onSubmit: z.object({ email: z.string().email() }) },
		onSubmit: ({ value }) => {
			toast.promise(new Promise((res) => setTimeout(res, 1000)), {
				loading: "Adding email...",
				success: "Verification email sent!",
				error: "Could not add email.",
				description: (
					<pre className="max-h-64 overflow-auto text-xs">
						{JSON.stringify(value, null, 2)}
					</pre>
				),
			});
			setOpen(false);
		},
	});

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button className="h-7 gap-1 text-xs" size="sm" variant="secondary">
					<PencilIcon className="size-3" /> Update Email
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update email</DialogTitle>
					<DialogDescription>
						Enter your new email address to update your profile.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<addEmailForm.AppField
						children={(field) => (
							<field.TextField
								description="You will need to verify the new email address before it can be used."
								icon={<AtSignIcon className="size-4" />}
								placeholder="work@company.com"
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
		<div className="max-w-4xl space-y-10">
			<div className="grid grid-cols-2 gap-12">
				<div className="space-y-6">
					<div className="flex items-center gap-6">
						<Skeleton className="size-24 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-8 w-24" />
							<Skeleton className="h-8 w-24" />
						</div>
					</div>
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
				<div className="space-y-6">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			</div>
		</div>
	);
}
