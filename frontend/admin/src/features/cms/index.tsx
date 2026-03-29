import { ContentEditor } from "@zero-heads-lab/cms/components/content-editor";
import { CMSInspector } from "@zero-heads-lab/cms/components/inspector";
import { SchemaEditor } from "@zero-heads-lab/cms/components/schema-editor";
import { useCMS } from "@zero-heads-lab/cms/provider";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import { Layers2 } from "lucide-react";
import { MainContent } from "@/layout/main-content";
import { SyncIndicator } from "./sync-indicator";

const CMS = () => {
	const { view } = useCMS();

	return (
		<MainContent
			headerRightContent={
				<div className="flex items-center gap-4">
					<ThemeSwitch />
					<SyncIndicator />
				</div>
			}
			rightSidebarHeaderContent={
				<span className="field-label">Field Inspector</span>
			}
			secondarySections={[
				{
					title: "CMS",
					items: [
						{
							id: "cms",
							label: "CMS",
							icon: Layers2,
						},
					],
				},
			]}
		>
			{view === "schema" ? <CMSInspector /> : null}
			{view === "schema" ? <SchemaEditor /> : <ContentEditor />}
		</MainContent>
	);
};

export default CMS;
