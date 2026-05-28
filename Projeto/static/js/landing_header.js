const LANDING_HEADER_MOBILE_MQ = "(max-width: 1023px)";

function isLandingHeaderMobile() {
    return window.matchMedia(LANDING_HEADER_MOBILE_MQ).matches;
}

function closeAllNavDropdowns(dropdowns) {
    for (const dropdown of dropdowns) {
        const trigger = dropdown.querySelector(".landing_header_nav_trigger");
        dropdown.classList.remove("is-open");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
    }
}

function getFocusableNavElements(container) {
    if (!container) return [];

    return Array.from(
        container.querySelectorAll(
            'a[href]:not([disabled]), button:not([disabled]):not([hidden]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
    ).filter((el) => el.offsetParent !== null && !el.closest("[hidden]"));
}

function isPointerOverNavDropdown(dropdown) {
    const menuInner = dropdown.querySelector(".landing_header_nav_menu_inner");

    return dropdown.matches(":hover") || (menuInner && menuInner.matches(":hover"));
}

function isPointerOverAnyNavDropdown(dropdowns) {
    for (const dropdown of dropdowns) {
        if (isPointerOverNavDropdown(dropdown)) return true;
    }
    return false;
}

function initLandingHeaderDropdowns() {
    const nav = document.getElementById("landing_header_nav");
    const dropdowns = document.querySelectorAll("[data-nav-dropdown]");
    if (!dropdowns.length) return;

    const closeDelayMs = 260;
    const mobileMq = window.matchMedia(LANDING_HEADER_MOBILE_MQ);
    let closeTimer = null;

    const clearCloseTimer = () => {
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }
    };

    const scheduleClose = () => {
        if (isLandingHeaderMobile()) return;

        clearCloseTimer();

        closeTimer = setTimeout(() => {
            if (isPointerOverAnyNavDropdown(dropdowns)) {
                closeTimer = null;
                return;
            }
            closeAllNavDropdowns(dropdowns);
            closeTimer = null;
        }, closeDelayMs);
    };

    const openNavDropdown = (dropdown) => {
        if (isLandingHeaderMobile()) return;

        const trigger = dropdown.querySelector(".landing_header_nav_trigger");
        if (!trigger) return;

        clearCloseTimer();
        updateLandingHeaderMetrics();

        for (const other of dropdowns) {
            if (other === dropdown) continue;
            const otherTrigger = other.querySelector(".landing_header_nav_trigger");
            other.classList.remove("is-open");
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }

        dropdown.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
    };

    for (const dropdown of dropdowns) {
        const trigger = dropdown.querySelector(".landing_header_nav_trigger");
        const menu = dropdown.querySelector(".landing_header_nav_menu");
        const menuInner = menu?.querySelector(".landing_header_nav_menu_inner") || menu;
        if (!trigger || !menu) continue;

        const setDropdownOpen = (open) => {
            dropdown.classList.toggle("is-open", open);
            trigger.setAttribute("aria-expanded", open ? "true" : "false");

            if (open && !isLandingHeaderMobile()) {
                updateLandingHeaderMetrics();
            }
        };

        const openDropdown = () => {
            openNavDropdown(dropdown);
        };

        const toggleDropdownMobile = () => {
            if (!isLandingHeaderMobile()) return;

            const willOpen = !dropdown.classList.contains("is-open");

            for (const other of dropdowns) {
                if (other === dropdown) continue;
                const otherTrigger = other.querySelector(".landing_header_nav_trigger");
                other.classList.remove("is-open");
                if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
            }

            setDropdownOpen(willOpen);
            requestAnimationFrame(updateLandingHeaderMetrics);
        };

        trigger.addEventListener("click", (e) => {
            if (!isLandingHeaderMobile()) return;
            e.preventDefault();
            e.stopPropagation();
            toggleDropdownMobile();
        });

        trigger.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                setDropdownOpen(false);
                return;
            }

            if (isLandingHeaderMobile()) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleDropdownMobile();
                }
                return;
            }

            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                e.preventDefault();
                openDropdown();
                const firstLink = menu.querySelector(".landing_header_nav_menu_link");
                firstLink?.focus();
            }
        });

        if (!isLandingHeaderMobile()) {
            dropdown.addEventListener("mouseenter", openDropdown);
            dropdown.addEventListener("mouseleave", scheduleClose);
            menu.addEventListener("mouseenter", openDropdown);
            menu.addEventListener("mouseleave", scheduleClose);
            menuInner?.addEventListener("mouseenter", openDropdown);
            menuInner?.addEventListener("mouseleave", scheduleClose);

            menu.addEventListener(
                "pointerdown",
                (e) => {
                    if (!e.target.closest("a[href]")) return;
                    clearCloseTimer();
                },
                true
            );

            menu.addEventListener("click", (e) => {
                const link = e.target.closest("a[href]");
                if (!link) return;

                const href = link.getAttribute("href");
                if (!href || href === "#") return;

                clearCloseTimer();
                requestAnimationFrame(() => closeAllNavDropdowns(dropdowns));
            });

            dropdown.addEventListener("focusin", openDropdown);
            dropdown.addEventListener("focusout", (e) => {
                if (dropdown.contains(e.relatedTarget)) return;
                scheduleClose();
            });
        }
    }

    if (nav && !isLandingHeaderMobile()) {
        nav.addEventListener("mouseover", (e) => {
            const trigger = e.target.closest(".landing_header_nav_trigger");
            if (trigger) {
                const dropdown = trigger.closest("[data-nav-dropdown]");
                if (dropdown) openNavDropdown(dropdown);
                return;
            }

            if (e.target.closest(".landing_header_nav_link")) {
                clearCloseTimer();
                closeAllNavDropdowns(dropdowns);
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || isLandingHeaderMobile()) return;
        closeAllNavDropdowns(dropdowns);
    });

    document.addEventListener(
        "pointerdown",
        (e) => {
            if (isLandingHeaderMobile()) return;

            if (e.target.closest(".landing_header_nav_menu a[href]")) return;

            const insideDropdown = e.target.closest("[data-nav-dropdown]");
            if (insideDropdown) return;

            closeAllNavDropdowns(dropdowns);
        },
        true
    );

    window.addEventListener("resize", () => {
        if (!isLandingHeaderMobile()) updateLandingHeaderMetrics();
    });

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => {
            if (!isLandingHeaderMobile()) updateLandingHeaderMetrics();
        });
    }

    mobileMq.addEventListener("change", () => closeAllNavDropdowns(dropdowns));
}

function updateLandingHeaderMetrics() {
    const header = document.querySelector(".landing_header");
    const nav = document.getElementById("landing_header_nav");
    if (!header) return;

    const headerRect = header.getBoundingClientRect();
    const barBottom = headerRect.bottom;
    document.documentElement.style.setProperty("--landing-header-bar-bottom", `${barBottom}px`);
    document.documentElement.style.setProperty("--landing-nav-left", `${headerRect.left}px`);
    document.documentElement.style.setProperty("--landing-nav-width", `${headerRect.width}px`);

    let backdropTop = barBottom;
    if (isLandingHeaderMobile() && header.classList.contains("is-nav-open") && nav) {
        backdropTop = Math.max(barBottom, nav.getBoundingClientRect().bottom);
    }

    document.documentElement.style.setProperty("--landing-header-bottom", `${backdropTop}px`);
}

function initLandingHeaderMobileMenu() {
    const header = document.querySelector(".landing_header");
    const toggle = document.querySelector("[data-nav-menu-toggle]");
    const nav = document.getElementById("landing_header_nav");
    const backdrop = document.querySelector("[data-nav-backdrop]");
    const dropdowns = document.querySelectorAll("[data-nav-dropdown]");

    if (!header || !toggle || !nav || !backdrop) return;

    const mobileMq = window.matchMedia(LANDING_HEADER_MOBILE_MQ);
    let navResizeObserver = null;
    let lastFocusedBeforeOpen = null;

    const setMenuOpen = (open) => {
        header.classList.toggle("is-nav-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
        document.body.classList.toggle("landing-header-nav-open", open);
        backdrop.hidden = !open;

        if (!open) {
            closeAllNavDropdowns(dropdowns);
            if (lastFocusedBeforeOpen && typeof lastFocusedBeforeOpen.focus === "function") {
                lastFocusedBeforeOpen.focus({ preventScroll: true });
            }
            lastFocusedBeforeOpen = null;
        } else {
            lastFocusedBeforeOpen = document.activeElement;
            const firstFocusable = getFocusableNavElements(nav)[0];
            requestAnimationFrame(() => firstFocusable?.focus({ preventScroll: true }));
        }

        if (navResizeObserver) {
            navResizeObserver.disconnect();
            navResizeObserver = null;
        }

        if (open && "ResizeObserver" in window) {
            navResizeObserver = new ResizeObserver(() => updateLandingHeaderMetrics());
            navResizeObserver.observe(nav);
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(updateLandingHeaderMetrics);
        });
    };

    const closeMenu = () => setMenuOpen(false);

    toggle.addEventListener("click", (e) => {
        if (!isLandingHeaderMobile()) return;
        e.stopPropagation();
        setMenuOpen(!header.classList.contains("is-nav-open"));
    });

    backdrop.addEventListener("click", () => {
        if (header.classList.contains("is-nav-open")) closeMenu();
    });

    nav.addEventListener("click", (e) => {
        if (!header.classList.contains("is-nav-open")) return;

        const trigger = e.target.closest(".landing_header_nav_trigger");
        if (trigger) return;

        const navigates = e.target.closest("a[href], button[data-open-auth-modal]");
        if (navigates) closeMenu();
    });

    nav.addEventListener("keydown", (e) => {
        if (!header.classList.contains("is-nav-open") || e.key !== "Tab") return;

        const focusables = getFocusableNavElements(nav);
        if (focusables.length < 2) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    document.addEventListener(
        "click",
        (e) => {
            if (!header.classList.contains("is-nav-open")) return;
            if (header.contains(e.target)) return;
            closeMenu();
        },
        true
    );

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && header.classList.contains("is-nav-open")) {
            closeMenu();
            toggle.focus();
        }
    });

    mobileMq.addEventListener("change", (e) => {
        if (!e.matches) closeMenu();
        updateLandingHeaderMetrics();
    });

    const onViewportChange = () => {
        updateLandingHeaderMetrics();
        if (!isLandingHeaderMobile()) closeMenu();
    };

    window.addEventListener("resize", onViewportChange);

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", onViewportChange);
        window.visualViewport.addEventListener("scroll", () => {
            if (header.classList.contains("is-nav-open")) {
                updateLandingHeaderMetrics();
            }
        });
    }

    updateLandingHeaderMetrics();
}

document.addEventListener("DOMContentLoaded", () => {
    initLandingHeaderDropdowns();
    initLandingHeaderMobileMenu();
});
