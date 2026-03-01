import {
	Avatar,
	AvatarFallback,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";

export function InfoPanel() {
	return (
		<div className="space-y-5 p-4">
			{/* Profile */}
			<div className="flex flex-col items-center text-center">
				<Avatar className="mb-3 h-16 w-16">
					<AvatarFallback className="bg-accent font-semibold text-accent-foreground text-lg">
						IS
					</AvatarFallback>
				</Avatar>
				<h3 className="font-semibold text-crm-right-foreground">
					Indigo Squirrel
				</h3>
				<p className="text-muted-foreground text-xs">indigo@company.com</p>
				<Button className="mt-2 h-7 text-xs" size="sm" variant="outline">
					View profile
				</Button>
			</div>

			<Separator />

			{/* Info Section */}
			<div>
				<h4 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					Info
				</h4>
				<div className="space-y-3">
					<InfoRow label="Signed Up" value="12/31/2024" />
					<InfoRow label="Subscribed" value="No" />
					<InfoRow label="Plan" value="Free Trial" />
				</div>
			</div>

			<Separator />

			{/* Location */}
			<div>
				<h4 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					Location
				</h4>
				<div className="space-y-3">
					<InfoRow label="City" value="Saalfelden" />
					<InfoRow label="Region" value="Salzburg" />
					<InfoRow label="Country" value="Austria" />
					<InfoRow label="Timezone" value="Europe/Vienna" />
				</div>
			</div>

			<Separator />

			{/* Technical */}
			<div>
				<h4 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					Technical
				</h4>
				<div className="space-y-3">
					<InfoRow label="IP Address" value="111.11.111.111" />
					<InfoRow label="Last Seen" value="02/28/2026" />
					<InfoRow label="Sessions" value="12" />
					<InfoRow label="Browser" value="Chrome 120" />
				</div>
			</div>
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-start justify-between">
			<span className="text-muted-foreground text-xs">{label}</span>
			<span className="text-right font-medium text-crm-right-foreground text-xs">
				{value}
			</span>
		</div>
	);
}
