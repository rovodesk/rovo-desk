export const useKnowledgeById = (id: string) => {
	return {
		data: {
			id,
			title: "Project Phoenix Specification",
			description:
				"Detailed architecture and technical requirements for the 2026 platform update.",
			image: `https://picsum.photos/seed/${id}/720/720`,
			content: [
				{
					type: "paragraph",
					content: "Press the ':' key to open the Emoji Picker",
				},
				{
					type: "paragraph",
					content: "Press the '/' key to open Menu",
				},
			],
		},
		isLoading: false,
	};
};
