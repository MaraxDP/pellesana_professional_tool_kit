(function () {
    "use strict";
    const isDevelopment = location.protocol === "file:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
    document.querySelectorAll("[data-development-note]").forEach(note => {
        note.hidden = !isDevelopment;
    });
    const year = document.querySelector("#currentYear");
    if (year) year.textContent = new Date().getFullYear();
})();
