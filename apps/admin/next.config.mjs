import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Your Next.js config here
	webpack: (webpackConfig) => {
		webpackConfig.resolve.extensionAlias = {
			".cjs": [".cts", ".cjs"],
			".js": [".ts", ".tsx", ".js", ".jsx"],
			".mjs": [".mts", ".mjs"],
		};

		return webpackConfig;
	},
	// async headers() {
	// 	return [
	// 		{
	// 			source: "/api/:path*",
	// 			headers: [
	// 				{ key: "Access-Control-Allow-Origin", value: "*" },
	// 				{ key: "Access-Control-Allow-Methods", value: "GET,POST" },
	// 				{
	// 					key: "Access-Control-Allow-Headers",
	// 					value:
	// 						"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
	// 				},
	// 			],
	// 		},
	// 	];
	// },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
