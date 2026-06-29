const ADMIN_USER = "lucia";
const ADMIN_PASS = "queennails2026";
const STORAGE_KEY = "qn_precios";

const PRECIOS_DEFAULT = {
    esculpidas:         "$26.500",
    kapping:            "$20.000",
    esmaltado:          "$17.500",
    service_esculpidas: "$23.500",
    service_diseno_u:   "$1.500",
    service_diseno_fs:  "$12.000",
    service_retirado:   "$10.000",
    perfilado:          "$15.000",
    laminado_cejas:     "$19.500",
    lifting:            "$18.000",
    combo1:             "$29.600",
    combo2:             "$30.500",
    combo3:             "$34.100",
    combo4:             "$48.500",
};

const ETIQUETAS = {
    esculpidas:         "Esculpidas (acrílico)",
    kapping:            "Kapping (gel)",
    esmaltado:          "Esmaltado semipermanente",
    service_esculpidas: "Service — Esculpidas",
    service_diseno_u:   "Service — Diseño por uña",
    service_diseno_fs:  "Service — Diseño full set",
    service_retirado:   "Service — Retirado",
    perfilado:          "Perfilado de cejas",
    laminado_cejas:     "Laminado de cejas",
    lifting:            "Lifting de pestañas",
    combo1:             "Combo 1 — Lifting + Perfilado",
    combo2:             "Combo 2 — Laminado + Perfilado",
    combo3:             "Combo 3 — Laminado + Lifting",
    combo4:             "Combo 4 — Laminado + Lifting + Perfilado",
};

let preciosActuales = {};

document.addEventListener("DOMContentLoaded", () => {
    cargarPrecios();

    if (document.querySelector("[data-price-id]")) {
        renderizarPrecios();
    }

    if (document.getElementById("login-section")) {
        initAdminPage();
    }
});

function cargarPrecios() {
    const guardados = localStorage.getItem(STORAGE_KEY);
    preciosActuales = guardados
        ? { ...PRECIOS_DEFAULT, ...JSON.parse(guardados) }
        : { ...PRECIOS_DEFAULT };
}

function guardarPrecios() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preciosActuales));
}

function renderizarPrecios() {
    document.querySelectorAll("[data-price-id]").forEach((el) => {
        const id = el.dataset.priceId;
        if (preciosActuales[id] !== undefined) {
            el.textContent = preciosActuales[id];
        }
    });
}

function initAdminPage() {
    const loginSec = document.getElementById("login-section");
    const adminSec = document.getElementById("admin-section");
    const btnLogin = document.getElementById("btn-login");
    const inputPass = document.getElementById("input-pass");

    if (sessionStorage.getItem("qn_admin_logged") === "true") {
        mostrarPanel();
    }

    btnLogin.addEventListener("click", intentarLogin);
    inputPass.addEventListener("keydown", (e) => {
        if (e.key === "Enter") intentarLogin();
    });

    document.getElementById("btn-guardar").addEventListener("click", guardarCambios);
    document.getElementById("btn-resetear").addEventListener("click", restaurarOriginales);
    document.getElementById("btn-cerrar-sesion").addEventListener("click", cerrarSesion);

    function intentarLogin() {
        const u = document.getElementById("input-user").value.trim();
        const p = inputPass.value;
        const err = document.getElementById("login-error");

        if (u === ADMIN_USER && p === ADMIN_PASS) {
            sessionStorage.setItem("qn_admin_logged", "true");
            if (err) err.textContent = "";
            mostrarPanel();
        } else {
            if (err) err.textContent = "Usuario o contraseña incorrectos.";
            inputPass.value = "";
        }
    }

    function mostrarPanel() {
        loginSec.style.display = "none";
        adminSec.style.display = "block";
        construirGridPrecios();
    }

    function construirGridPrecios() {
        const grid = document.getElementById("admin-price-grid");
        grid.innerHTML = "";

        Object.keys(ETIQUETAS).forEach((id) => {
            const valor = preciosActuales[id] || "";
            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-lg-4";
            col.innerHTML = `
                <label class="admin-label font-outfit" for="p-${id}">${ETIQUETAS[id]}</label>
                <input class="admin-input font-outfit" type="text" id="p-${id}" data-edit-id="${id}" value="${valor}" />
            `;
            grid.appendChild(col);
        });
    }

    function guardarCambios() {
        document.querySelectorAll("[data-edit-id]").forEach((input) => {
            const id = input.dataset.editId;
            let val = input.value.trim();
            if (val && !val.startsWith("$")) val = "$" + val;
            preciosActuales[id] = val;
        });

        guardarPrecios();
        dispararModalConfirmacion();
    }

    function restaurarOriginales() {
        if (!confirm("¿Restaurar todos los precios a los valores originales?")) return;
        preciosActuales = { ...PRECIOS_DEFAULT };
        guardarPrecios();
        construirGridPrecios();
        dispararModalConfirmacion();
    }

    function dispararModalConfirmacion() {
        const el = document.getElementById('modalExito');
        if (typeof bootstrap !== 'undefined' && el) {
            new bootstrap.Modal(el).show();
        } else {
            alert("✅ ¡Cambios guardados! Publicados con éxito.");
        }
    }

    function cerrarSesion() {
        sessionStorage.removeItem("qn_admin_logged");
        window.location.href = "index.html";
    }
}