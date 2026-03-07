export default {
	extends: ["@commitlint/config-conventional"],

	rules: {
		// Allow long subjects (your main issue)
		"header-max-length": [0],

		// Keep basic correctness
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"refactor",
				"perf",
				"test",
				"chore",
				"build",
				"ci",
				"style",
				"revert",
			],
		],

		// Subject rules (relaxed)
		"subject-empty": [2, "never"],
		"subject-full-stop": [0],
		"subject-case": [0],

		// Body & footer — optional, not enforced
		"body-leading-blank": [0],
		"body-max-line-length": [0],
		"footer-leading-blank": [0],
		"footer-max-line-length": [0],
	},
};
