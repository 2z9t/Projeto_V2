const THEME_KEY = "auth_theme";
const THEME_TOGGLE_SELECTOR = "[data-theme-toggle]";

const THEME_LABELS = {
    system: "Tema: dispositivo",
    light: "Tema: claro",
    dark: "Tema: escuro",
};

(function applySavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
    }
})();

function getCurrentTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "system";
}

function getNextTheme(current) {
    if (current === "system") return "light";
    if (current === "light") return "dark";
    return "light";
}

let themeSwitchTimeoutId = null;

function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.add("theme_is_switching");

    if (theme === "system") {
        root.removeAttribute("data-theme");
        localStorage.removeItem(THEME_KEY);
    } else {
        root.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    syncThemeToggleUI();

    if (themeSwitchTimeoutId) window.clearTimeout(themeSwitchTimeoutId);
    themeSwitchTimeoutId = window.setTimeout(() => {
        root.classList.remove("theme_is_switching");
        themeSwitchTimeoutId = null;
    }, 250);
}

function syncThemeToggleUI() {
    const theme = getCurrentTheme();

    for (const button of document.querySelectorAll(THEME_TOGGLE_SELECTOR)) {
        const iconSrc = button.getAttribute(`data-icon-${theme}`);
        const icon = button.querySelector(".toggle_theme_button_icon");
        const label = button.querySelector(".toggle_theme_button_label");

        button.setAttribute("data-theme-mode", theme);
        button.setAttribute("aria-current", "true");

        if (icon && iconSrc) icon.src = iconSrc;
        if (label) label.textContent = THEME_LABELS[theme] || THEME_LABELS.system;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    syncThemeToggleUI();

    for (const button of document.querySelectorAll(THEME_TOGGLE_SELECTOR)) {
        button.addEventListener("click", () => {
            applyTheme(getNextTheme(getCurrentTheme()));
        });
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => document.documentElement.classList.add("theme_intro_done"));
    });
});
