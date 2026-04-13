type PageItem = number | "...";

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(
	currentPage: number,
	totalPages: number
): PageItem[] {
	const MAX_VISIBLE = 5; // Maximum number of page buttons to show
	const pages: PageItem[] = [];

	// Defensive guards
	if (!(Number.isInteger(currentPage) && Number.isInteger(totalPages))) {
		throw new Error("currentPage and totalPages must be integers");
	}

	if (totalPages <= 0) return [];

	// Use local immutable value instead of mutating parameter
	const page = Math.min(Math.max(currentPage, 1), totalPages);

	// Small dataset → show all pages
	if (totalPages <= MAX_VISIBLE) {
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i);
		}
		return pages;
	}

	// Always show first page
	pages.push(1);

	const start = Math.max(2, page - 1);
	const end = Math.min(totalPages - 1, page + 1);

	// Leading ellipsis
	if (start > 2) {
		pages.push("...");
	}

	// Middle window
	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	// Trailing ellipsis
	if (end < totalPages - 1) {
		pages.push("...");
	}

	// Always show last page
	pages.push(totalPages);

	return pages;
}
