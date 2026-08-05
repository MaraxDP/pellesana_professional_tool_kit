(function () {
    "use strict";

    const STORAGE_KEY = "pps_cookie_consent_v1";
    const CONSENT_VERSION = 1;

    function readConsent() {
        try {
            const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
            return value && value.version === CONSENT_VERSION ? value : null;
        } catch (_) {
            return null;
        }
    }

    function writeConsent(externalContent) {
        const value = {
            version: CONSENT_VERSION,
            necessary: true,
            externalContent: Boolean(externalContent),
            savedAt: new Date().toISOString()
        };
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } catch (_) {
            // Il consenso resta valido per la sessione anche se lo storage è bloccato.
        }
        window.dispatchEvent(new CustomEvent("pps:consent-changed", { detail: value }));
        return value;
    }

    function hasExternalContentConsent() {
        return Boolean(readConsent()?.externalContent);
    }

    function initConsentUi() {
        const banner = document.querySelector("#cookieBanner");
        const dialog = document.querySelector("#cookiePreferences");
        const externalInput = document.querySelector("#consentExternal");

        function closeDialog() {
            if (!dialog) return;
            if (typeof dialog.close === "function" && dialog.open) dialog.close();
            else dialog.removeAttribute("open");
        }

        function openDialog() {
            if (!dialog) return;
            const current = readConsent();
            if (externalInput) externalInput.checked = Boolean(current?.externalContent);
            if (typeof dialog.showModal === "function") dialog.showModal();
            else dialog.setAttribute("open", "open");
        }

        function finish(externalContent) {
            writeConsent(externalContent);
            if (banner) banner.hidden = true;
            closeDialog();
        }

        document.querySelectorAll("[data-consent-accept]").forEach(button => {
            button.addEventListener("click", () => finish(true));
        });
        document.querySelectorAll("[data-consent-reject]").forEach(button => {
            button.addEventListener("click", () => finish(false));
        });
        document.querySelectorAll("[data-consent-customize], [data-cookie-settings]").forEach(button => {
            button.addEventListener("click", openDialog);
        });
        document.querySelectorAll("[data-consent-close]").forEach(button => {
            button.addEventListener("click", closeDialog);
        });
        document.querySelectorAll("[data-consent-save]").forEach(button => {
            button.addEventListener("click", () => finish(Boolean(externalInput?.checked)));
        });

        if (dialog) {
            dialog.addEventListener("click", event => {
                if (event.target === dialog) closeDialog();
            });
        }

        if (banner) banner.hidden = Boolean(readConsent());
    }

    window.PPSConsent = {
        get: readConsent,
        save: writeConsent,
        hasExternalContent: hasExternalContentConsent,
        storageKey: STORAGE_KEY
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initConsentUi);
    } else {
        initConsentUi();
    }
})();
