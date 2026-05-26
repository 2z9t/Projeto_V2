const PASSWORD_MIN_LENGTH = 8;

function isPasswordLengthValid(password) {
    return String(password ?? "").length >= PASSWORD_MIN_LENGTH;
}

function scorePasswordStrength(password) {
    const raw = String(password ?? "");
    const length = raw.length;
    if (length === 0) return { score: 0, bucket: "weak" };

    const hasLower = /[a-z]/.test(raw);
    const hasUpper = /[A-Z]/.test(raw);
    const hasDigit = /\d/.test(raw);
    const hasSpecial = /[^A-Za-z0-9]/.test(raw);

    const varietyCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

    let score = 0;
    score += Math.min(50, Math.floor((length / 12) * 50));
    score += (varietyCount / 4) * 50;
    score = Math.max(0, Math.min(100, Math.round(score)));

    let bucket = "weak";
    if (score >= 70 && length >= 10 && varietyCount >= 3) bucket = "strong";
    else if (score >= 40 && length >= PASSWORD_MIN_LENGTH && varietyCount >= 2) bucket = "medium";

    return { score, bucket };
}

const ANIM_FIELD = "fade_in_out_validation_auth 1.5s ease-in-out both alternate";
const ANIM_RESET = "none";

const BTN_ANIM_ERR_CLASS = "auth_btn_anim_error";
const BTN_ANIM_OK_CLASS = "auth_btn_anim_ok";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_OK = /^[A-Za-z0-9_]{3,32}$/;

const FIELD_ERROR_CLASS = "auth_field_has_error";

function isRegisterPage() {
    return document.body?.classList?.contains("auth_page_register");
}

function clearError(el) {
    if (!el) return;
    el.textContent = "";
    el.style.animation = ANIM_RESET;
}

function getFieldContainer(inputEl) {
    if (!inputEl) return null;
    return (
        inputEl.closest(".auth_form_content_input_container") ||
        inputEl.closest("#auth_form_content_terms_container")
    );
}

function clearFieldError(inputEl, errorEl) {
    clearError(errorEl);
    const container = getFieldContainer(inputEl);
    container?.classList.remove(FIELD_ERROR_CLASS);
}

function setFieldError(inputEl, errorEl, message) {
    if (!errorEl) return;

    errorEl.textContent = message;
    errorEl.style.animation = ANIM_FIELD;

    const container = getFieldContainer(inputEl);
    container?.classList.add(FIELD_ERROR_CLASS);

    if (!inputEl) return;

    const eventName = inputEl.type === "checkbox" ? "change" : "input";
    const onEdit = () => clearFieldError(inputEl, errorEl);
    inputEl.addEventListener(eventName, onEdit, { once: true });
}

function triggerAnimClass(el, className) {
    if (!el) return;

    const token = String((Number(el.dataset.animToken ?? "0") || 0) + 1);
    el.dataset.animToken = token;

    el.classList.remove(className);
    void el.offsetWidth; // reflow to restart animation reliably
    el.classList.add(className);

    return new Promise((resolve) => {
        const cleanup = () => {
            if ((el.dataset.animToken ?? "") !== token) return;
            el.classList.remove(className);
            resolve();
        };

        el.addEventListener("animationend", cleanup, { once: true });
        el.addEventListener("animationcancel", cleanup, { once: true });
    });
}

function setButtonBusy(btn, busy) {
    if (!btn) return;
    btn.disabled = Boolean(busy);
    btn.setAttribute("aria-disabled", busy ? "true" : "false");
    btn.setAttribute("aria-busy", busy ? "true" : "false");
}

async function verify_authentication(e) {
    e.preventDefault();

    const button = document.getElementById("auth_form_content_submit_button");
    const usernameInput = document.getElementById("auth_form_content_username_input");
    const usernameError = document.getElementById("auth_form_content_username_title_error");
    const emailInput = document.getElementById("auth_form_content_email_input");
    const emailError = document.getElementById("auth_form_content_email_title_error");
    const passwordInput = document.getElementById("auth_form_content_password_input");
    const passwordError = document.getElementById("auth_form_content_password_title_error");
    const termsError = document.getElementById("auth_form_content_terms_error");
    const checkbox = document.getElementById("auth_form_content_terms_checkbox");

    clearFieldError(usernameInput, usernameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);
    clearFieldError(checkbox, termsError);

    const email = emailInput?.value ?? "";
    const password = passwordInput?.value ?? "";
    const hasUser = Boolean(usernameInput && usernameError);
    const userOk = !hasUser || USER_OK.test(usernameInput.value.trim());
    const emailOk = EMAIL_OK.test(email);
    const passOk = isPasswordLengthValid(password);
    const termsOk = !checkbox || checkbox.checked;

    const ok = userOk && emailOk && passOk && termsOk;

    if (!ok && button) {
        triggerAnimClass(button, BTN_ANIM_ERR_CLASS);
    }

    if (!userOk) {
        setFieldError(
            usernameInput,
            usernameError,
            "Use 3–32 caracteres",
        );
    }
    if (!emailOk) setFieldError(emailInput, emailError, "Digite um email válido");
    if (!passOk) {
        setFieldError(
            passwordInput,
            passwordError,
            `Mínimo de ${PASSWORD_MIN_LENGTH} caracteres`,
        );
    }
    if (!termsOk) {
        const msg = "Marque a caixa para aceitar os termos";
        if (termsError) setFieldError(checkbox, termsError, msg);
        else if (passOk) setFieldError(passwordInput, passwordError, msg);
    }

    if (ok && button) {
        setButtonBusy(button, true);
        await triggerAnimClass(button, BTN_ANIM_OK_CLASS);
        setButtonBusy(button, false);
    }
}

function initPasswordToggle() {
    const passwordInput = document.getElementById("auth_form_content_password_input");
    const passwordToggle = document.getElementById("auth_form_content_password_toggle");
    if (!passwordInput || !passwordToggle) return;

    const passwordWrap = passwordInput.closest(".auth_form_content_password_wrap");
    if (passwordWrap) {
        passwordWrap.classList.toggle("password-visible", passwordInput.type === "text");
    }

    passwordToggle.addEventListener("click", () => {
        const showing = passwordInput.type === "text";
        passwordInput.type = showing ? "password" : "text";
        const visible = passwordInput.type === "text";
        passwordToggle.setAttribute("aria-pressed", visible ? "true" : "false");
        passwordToggle.setAttribute(
            "aria-label",
            visible ? "Ocultar senha digitada" : "Mostrar senha digitada",
        );
        passwordWrap?.classList.toggle("password-visible", visible);
    });
}

function initPasswordStrengthMeter() {
    if (!isRegisterPage()) return;

    const passwordInput = document.getElementById("auth_form_content_password_input");
    const passwordTitle = document.getElementById("auth_form_content_password_title");
    const label = document.getElementById("auth_password_strength_label");
    if (!passwordInput || !label) return;

    const bucketLabel = (bucket) => {
        if (bucket === "strong") return "forte";
        if (bucket === "medium") return "média";
        return "fraca";
    };

    const bucketColor = (bucket) => {
        if (bucket === "strong") return "var(--success-color)";
        if (bucket === "medium") return "#f2b705";
        return "var(--error-color)";
    };

    const render = () => {
        const value = String(passwordInput.value ?? "");
        const { bucket } = scorePasswordStrength(value);
        label.textContent = `Força: ${bucketLabel(bucket)}`;
        const color = bucketColor(bucket);
        label.style.color = color;

        if (value.length > 0) {
            passwordTitle && (passwordTitle.style.color = color);
            passwordInput.style.borderColor = color;
            passwordInput.style.setProperty("--password-strength-color", color);
        } else {
            passwordTitle && (passwordTitle.style.color = "");
            passwordInput.style.borderColor = "";
            passwordInput.style.removeProperty("--password-strength-color");
        }
    };

    render();
    passwordInput.addEventListener("input", render);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth_form_content")?.addEventListener("submit", verify_authentication);
    initPasswordToggle();
    initPasswordStrengthMeter();
});
