import type React from "react";

const MainContent = ({ children }: { readonly children: React.ReactNode }) => {
	return <div className="h-full w-full overflow-auto p-8">{children}</div>;
};

export default MainContent;
