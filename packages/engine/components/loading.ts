export const loading = () => {
    const loading = document.createElement("div");

    Object.assign(loading.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px 16px",
        background: "#111",
        color: "#fff",
        borderRadius: "12px",
        fontSize: "13px",
    });

    loading.textContent = "Loading widget...";

    return loading;
}

export function renderLoading(rootEl?: HTMLElement) {
    const root = rootEl ?? document.body;
    root.replaceChildren();
    return root.appendChild(loading());
}