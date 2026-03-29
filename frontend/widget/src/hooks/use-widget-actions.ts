import { useWidgetContext } from "../context";

export function useWidgetActions() {
	const { actions } = useWidgetContext();
	return actions;
}
