import { Breadcrumbs } from "@/components/breadcrumbs";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";
import { AppearanceForm } from "./appearance-form";

export const CustomiseBot = () => {
	return (
		<>
			<Header>
				<Breadcrumbs />
			</Header>

			<MainContent>
				<AppearanceForm />
			</MainContent>
		</>
	);
};

export default CustomiseBot;
