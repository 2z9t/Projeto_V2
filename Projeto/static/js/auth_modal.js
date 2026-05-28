function initAuthModalOpenClose() {
    const modal = document.querySelector("[data-auth-modal]");
    if (!modal) return;

    const openers = document.querySelectorAll("[data-open-auth-modal]");
    const closeEls = modal.querySelectorAll("[data-auth-modal-close]");
    const dialog = modal.querySelector("[data-auth-modal-dialog]") || modal;

    const ANIM_OPEN = "auth_modal_anim_open";
    const ANIM_CLOSE = "auth_modal_anim_close";

    const stopAnims = () => {
        dialog?.classList?.remove(ANIM_OPEN, ANIM_CLOSE);
    };

    const playAnim = (className) => {
        if (!dialog?.classList) return Promise.resolve();
        dialog.classList.remove(ANIM_OPEN, ANIM_CLOSE);
        void dialog.offsetWidth;
        dialog.classList.add(className);
        return new Promise((resolve) => {
            dialog.addEventListener("animationend", resolve, { once: true });
            dialog.addEventListener("animationcancel", resolve, { once: true });
        });
    };

    const setOpen = async (open) => {
        stopAnims();

        if (open) {
            modal.hidden = false;
            document.documentElement.classList.add("auth_modal_open");
            await playAnim(ANIM_OPEN);
            dialog?.focus?.();
            return;
        }

        if (modal.hidden) return;
        document.documentElement.classList.remove("auth_modal_open");
        await playAnim(ANIM_CLOSE);
        modal.hidden = true;
        stopAnims();
    };

    for (const opener of openers) {
        opener.addEventListener("click", () => {
            const mode = opener?.dataset?.authOpenMode;
            if (mode === "login" || mode === "register") {
                dialog?.dispatchEvent?.(new CustomEvent("auth:set-mode", { detail: { mode } }));
            }
            setOpen(true);
        });
    }
    for (const el of closeEls) {
        el.addEventListener("click", () => setOpen(false));
    }

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (!modal.hidden) setOpen(false);
    });
}

document.addEventListener("DOMContentLoaded", initAuthModalOpenClose);

