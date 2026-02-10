import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { ScrollFade } from "@zero-heads-lab/design-system/components/ui/scroll-fade";
import { ChevronsUpDownIcon, Filter, List } from "lucide-react";
import { Search } from "@/components/search";
import { Header } from "@/layout/header";
import { DocCard } from "./_components/document-card";
import { BlankTemplateCard, TemplateCard } from "./_components/template-card";

const templates = [
	{ title: "Resume", description: "Resume template" },
	{ title: "Letter", description: "Letter template" },
	{ title: "Proposal", description: "Proposal template" },
	{ title: "Invoice", description: "Invoice template" },
	{ title: "Receipt", description: "Receipt template" },
	{ title: "Contract", description: "Contract template" },
	{ title: "Open Bank", description: "Open Bank template" },
	{ title: "Open Invoice", description: "Open Invoice template" },
	{ title: "Open Receipt", description: "Open Receipt template" },
];

const documents = [
	{ title: "API Notes" },
	{ title: "Product Specs" },
	{ title: "Design Review" },
	{ title: "API Notes" },
	{ title: "Product Specs" },
	{ title: "Design Review" },
	{ title: "API Notes" },
	{ title: "Product Specs" },
	{ title: "Design Review" },
];

export function KnowledgeBaseHome() {
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<Header className="border-b">
				<div className="flex items-center gap-4">
					<span className="font-semibold text-lg">Docs</span>
				</div>

				<div className="mx-auto w-full max-w-xl">
					<Search />
				</div>

				<div className="ms-auto flex items-center gap-2">
					<ThemeSwitch />
				</div>
			</Header>

			<main className="mx-auto space-y-10 px-6 py-8">
				<section className="rounded-lg bg-muted-foreground/10 p-6">
					{/* Header */}
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-semibold text-lg">Start a new document</h2>
						<Button size="sm" variant="outline">
							Template Gallery
						</Button>
					</div>
					{/* Templates */}
					<ScrollFade axis="horizontal" className="w-full">
						{/* Horizontal scroll row */}
						<div className="flex gap-4">
							{/* Blank Template */}
							<BlankTemplateCard />

							{/* Other Templates */}
							{templates.map((template) => (
								<TemplateCard key={template.title} {...template} />
							))}
						</div>
					</ScrollFade>
				</section>

				{/* Recent */}
				<section className="rounded-lg p-6">
					{/* Header */}
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-semibold text-lg">Recent Documents</h2>

						<div className="flex items-center gap-2">
							<Button size="icon" variant="ghost">
								<ChevronsUpDownIcon className="h-4 w-4" />
							</Button>
							<Button size="icon" variant="ghost">
								<List className="h-4 w-4" />
							</Button>
							<Button size="icon" variant="ghost">
								<Filter className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Documents */}
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4">
						{documents.map((document) => (
							<DocCard key={document.title} {...document} />
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
