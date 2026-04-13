import { friendlyWords as words } from "friendlier-words";

export const friendlyWords = (segments = 2, separator = " "): string => {
	return words(segments, separator);
};
