const THEME_KEY = "auth_theme";
const THEME_TOGGLE_IDS = [
    "toggle_theme_button_input_light",
    "toggle_theme_button_input_dark",
    "toggle_theme_button_input_system",
];

(function applySavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
    }
})();

function syncThemeToggleFromStorage() {
    const saved = localStorage.getItem(THEME_KEY);
    const active =
        saved === "light"
            ? THEME_TOGGLE_IDS[0]
            : saved === "dark"
              ? THEME_TOGGLE_IDS[1]
              : THEME_TOGGLE_IDS[2];

    for (const id of THEME_TOGGLE_IDS) {
        document.getElementById(id)?.removeAttribute("aria-current");
    }
    document.getElementById(active)?.setAttribute("aria-current", "true");
}

let themeSwitchTimeoutId = null;

function toggleTheme(theme) {
    const root = document.documentElement;
    root.classList.add("theme_is_switching");
    if (theme === "system") {
        root.removeAttribute("data-theme");
        localStorage.removeItem(THEME_KEY);
    } else {
        root.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }
    syncThemeToggleFromStorage();

    if (themeSwitchTimeoutId) window.clearTimeout(themeSwitchTimeoutId);
    // Keep it long enough to suppress hover/focus animations after click.
    themeSwitchTimeoutId = window.setTimeout(() => {
        root.classList.remove("theme_is_switching");
        themeSwitchTimeoutId = null;
    }, 250);
}

document.addEventListener("DOMContentLoaded", () => {
    syncThemeToggleFromStorage();

    const byId = (id) => document.getElementById(id);
    byId(THEME_TOGGLE_IDS[0])?.addEventListener("click", () => toggleTheme("light"));
    byId(THEME_TOGGLE_IDS[1])?.addEventListener("click", () => toggleTheme("dark"));
    byId(THEME_TOGGLE_IDS[2])?.addEventListener("click", () => toggleTheme("system"));

    // After the initial paint, mark intro as done so it won't replay.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => document.documentElement.classList.add("theme_intro_done"));
    });
});

