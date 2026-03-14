export interface Media {
	id: string;

	filename: string;
	mimeType: string;

	url: string;

	width?: number;
	height?: number;
	size?: number;

	createdAt: Date;
}
