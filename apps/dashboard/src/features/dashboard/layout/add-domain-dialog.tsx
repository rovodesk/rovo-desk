import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@zero-heads-lab/design-system/components/ui/dialog";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { SidebarGroupAction } from "@zero-heads-lab/design-system/components/ui/sidebar";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useDomains } from "@/hooks/use-domains";

export function AddDomainDialog() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");

	const { createDomain } = useDomains();

	// Use the status from TanStack Query instead of local 'pending' state
	const isPending = createDomain.isPending;

	const onNameChange = (value: string) => {
		setName(value);
		setSlug(
			value
				.toLowerCase()
				.trim()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "")
		);
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const domain = await createDomain.mutateAsync({ name, slug });
			toast.success(`${domain.name} is ready`);

			setOpen(false);
			setName("");
			setSlug("");
		} catch (err) {
			console.error(err);
			// Error handling is likely already managed in useDomains,
			// but keeping toast here is fine for specific UI feedback
			toast.error("Failed to create domain", {
				description: "Something went wrong. Please try again later.",
			});
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<SidebarGroupAction title="Add Domain">
					<Plus className="size-4" />
				</SidebarGroupAction>
			</DialogTrigger>

			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Create New Domain</DialogTitle>
						<DialogDescription>
							Domain names and slugs identify your projects.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Display Name</Label>
							<Input
								autoFocus
								disabled={isPending}
								id="name"
								onChange={(e) => onNameChange(e.target.value)}
								required
								value={name}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="slug">URL Slug</Label>
							<Input
								disabled={isPending}
								id="slug"
								onChange={(e) => setSlug(e.target.value)}
								required
								value={slug}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							disabled={isPending}
							onClick={() => setOpen(false)}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>

						<Button disabled={isPending || !name || !slug} type="submit">
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating…
								</>
							) : (
								"Create Domain"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
