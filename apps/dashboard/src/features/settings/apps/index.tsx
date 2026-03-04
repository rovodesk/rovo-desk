import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@zero-heads-lab/design-system/components/ui/tabs";
import SectionMain from "@/features/settings/_components/section-main";
import { SectionHeader } from "../_components/section-header";
import { AddConnection } from "./_components/add-connection-drawer";
import { AppearanceForm } from "./_components/appearance-form";

export const AppSettings = () => {
	return (
		<SectionMain>
			<SectionHeader
				description="Manage your applications"
				title="Applications"
			/>

			<Tabs
				className="mt-10 ml-10 flex w-full flex-col gap-12"
				defaultValue="all"
			>
				<TabsList variant="line">
					<TabsTrigger value="all">All Application</TabsTrigger>
					<TabsTrigger value="general">General Settings</TabsTrigger>
					<TabsTrigger value="install">Install</TabsTrigger>
				</TabsList>

				<TabsContent className="mt-6 ml-10 max-w-7xl" value="general">
					<AppearanceForm />
				</TabsContent>
				<TabsContent className="mt-6 ml-10 max-w-7xl" value="install">
					<AddConnection />
				</TabsContent>
			</Tabs>
		</SectionMain>
	);
};

export default AppSettings;
