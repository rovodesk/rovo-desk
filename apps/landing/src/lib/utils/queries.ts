import { data } from "@/data";

// biome-ignore lint/suspicious/useAwait: Will be replaced with real API call in production
export const getHomePage = async () => {
	// const res = await fetch(
	// 	`${env.PUBLIC_API_URL}/api/pages/69af1b12498f4b89420be784`,
	// 	{
	// 		method: "GET",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		signal: AbortSignal.timeout(5000),
	// 		keepalive: true,
	// 	}
	// );

	// if (!res.ok) {
	// 	throw new Error("Failed to fetch home page data");
	// }
	// return await res.json();

	// For development, return data from local JSON file
	const pageData = data.pages.find((page) => page.slug === "home");
	if (!pageData) {
		throw new Error("Home page data not found");
	}
	return pageData;
};
