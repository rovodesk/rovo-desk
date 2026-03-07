import type { ChatbotEngine } from "core/engine";
import { renderScreen } from "core/renderer";
import type { BotState } from "types";
import { resolveActiveBlocks } from "utils";

export function renderWelcomeScreen(
	state: BotState,
	engine: ChatbotEngine<BotState>
): HTMLElement {
	const container = document.createElement("div");

	Object.assign(container.style, {
		display: "flex",
		flexDirection: "column",
		flex: "1",
		overflowY: "auto",
		background: `
      radial-gradient(
        circle at top left,
        rgba(99,102,241,0.15),
        transparent 50%
      ),
      #0f172a
    `,
	});

	container.id = "welcome-screen";

	// resolve blocks dynamically
	const blocks = resolveActiveBlocks(state);

	const screen = renderScreen(blocks, engine);

	container.appendChild(screen);

	return container;
}
