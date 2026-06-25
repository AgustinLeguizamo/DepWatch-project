const welcomeScreen = document.getElementById("welcome-screen");
const historyContainer = document.getElementById("history-container");
const noResults = document.getElementById("no-results");
const btnToggle = document.getElementById("btn-toggle");
const sidebar = document.getElementById("sidebar");
const vulnerabilityBanner = document.getElementById("vulnerability-banner");
const packageName = document.getElementById("package-name");
const packageVersion = document.getElementById("package-version");
const ecosystemSelect = document.getElementById("ecosystem-select");
const orderSelect = document.getElementById("order-select");
const btnSearch = document.getElementById("btn-search");
const btnLoadMore = document.getElementById("btn-load-more");
const paginationContainer = document.getElementById("loadmore-container");
const infoFooter = document.getElementById("info-footer");
const filterBar = document.getElementById("filter-bar");
const filterBarParentOriginal = filterBar.parentNode;
const filterBarSiblingOriginal = filterBar.nextSibling;

const userAction = document.getElementById("user-action");

userAction.addEventListener("click", () => {
    window.location.href = "https://google.github.io/osv.dev/api/";
});

welcomeScreen.appendChild(filterBar);
filterBar.classList.add("centered");

function moverFilterBarArriba() {
    if (!filterBar.classList.contains("centered")) return; // ya se movió antes
    filterBar.classList.remove("centered");
    filterBarParentOriginal.insertBefore(filterBar, filterBarSiblingOriginal);
}

let todasLasVulnerabilidades = [];
let cantidadVisible = 9;

let searchToken = 0;

sidebar.classList.add("collapsed");

btnToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});

/* =========================
   CERRAR SIDEBAR AL TOCAR AFUERA (solo mobile)
========================= */

document.addEventListener("click", (e) => {

    const esMobile = window.innerWidth <= 768;
    const sidebarAbierta = !sidebar.classList.contains("collapsed");

    if (!esMobile || !sidebarAbierta) return;

    const clickDentroSidebar = sidebar.contains(e.target);
    const clickEnBoton = btnToggle.contains(e.target);

    if (!clickDentroSidebar && !clickEnBoton) {
        sidebar.classList.add("collapsed");
    }
});

function resetUI() {
    welcomeScreen.classList.add("hidden");
    vulnerabilityBanner.classList.add("hidden");
    noResults.classList.add("hidden");
    paginationContainer.classList.add("hidden");
    infoFooter.classList.add("hidden");
    document.getElementById("cards-container").innerHTML = "";
}

/* =========================
   SEARCH (lógica compartida)
========================= */

async function ejecutarBusqueda(nombre, version, ecosistema) {

    moverFilterBarArriba();

    const miToken = ++searchToken;

    resetUI();

    const body = {
        package: {
            name: nombre,
            ecosystem: ecosistema
        }
    };

    if (version) body.version = version;

    try {

        const respuesta = await fetch("https://api.osv.dev/v1/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const datos = await respuesta.json();

        if (miToken !== searchToken) return;

        const vulnerabilidades = datos.vulns || [];

        guardarBusqueda(nombre, version, ecosistema);

        todasLasVulnerabilidades = vulnerabilidades;
        cantidadVisible = 9;

        resetUI();

        if (vulnerabilidades.length > 0) {

            renderizarCards(vulnerabilidades.slice(0, cantidadVisible));

            vulnerabilityBanner.classList.remove("hidden");
            vulnerabilityBanner.innerHTML = `
                🔴 Vulnerable<br>
                ${vulnerabilidades.length} vulnerabilidades encontradas
            `;

            if (vulnerabilidades.length > cantidadVisible) {
                paginationContainer.classList.remove("hidden");
            }

        } else {

            noResults.classList.remove("hidden");
            noResults.innerHTML = `
                <h1>🟢</h1>
                <h2>Sin vulnerabilidades conocidas</h2>
                <p>No se encontraron vulnerabilidades.</p>
            `;
        }

        infoFooter.classList.remove("hidden");

    } catch (error) {

        if (miToken !== searchToken) return;

        resetUI();

        noResults.classList.remove("hidden");
        noResults.innerHTML = `
            <h1>⚠️</h1>
            <h2>Error de conexión</h2>
            <p>No se pudo consultar la API OSV.</p>
        `;

        infoFooter.classList.remove("hidden");
    }
}

btnSearch.addEventListener("click", () => {

    const nombre = packageName.value.trim();
    const version = packageVersion.value.trim();
    const ecosistema = ecosystemSelect.value;

    if (!nombre) return alert("Debe ingresar un paquete");
    if (!ecosistema) return alert("Debe seleccionar un ecosistema");

    ejecutarBusqueda(nombre, version, ecosistema);
});

/* =========================
   LOAD MORE
========================= */

btnLoadMore.addEventListener("click", () => {

    cantidadVisible += 12;

    renderizarCards(
        todasLasVulnerabilidades.slice(0, cantidadVisible)
    );

    if (cantidadVisible >= todasLasVulnerabilidades.length) {
        paginationContainer.classList.add("hidden");
    }
});

/* =========================
   CARDS
========================= */

function renderizarCards(vulnerabilidades) {

    const container = document.getElementById("cards-container");
    container.innerHTML = "";

    for (const vuln of vulnerabilidades) {

        const fecha = new Date(vuln.modified).toLocaleDateString("es-AR");
        const resumen = vuln.summary || "Sin resumen disponible";
        const cve = vuln.aliases?.[0] || "Sin CVE";

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-content">
                <h3>${vuln.id}</h3>
                <div class="card-cve">${cve}</div>
                <p>${resumen}</p>
            </div>
            <small>${fecha}</small>
        `;

        card.addEventListener("click", () => mostrarModal(vuln));

        container.appendChild(card);
    }
}

/* =========================
   MODAL
========================= */

function mostrarModal(vuln) {

    const overlay = document.getElementById("modal-overlay");
    const modalCard = document.getElementById("modal-card");

    modalCard.innerHTML = `
        <h2>${vuln.id}</h2>
        <div class="modal-cve">${vuln.aliases?.[0] || "Sin CVE"}</div>
        <h3>Resumen</h3>
        <p>${vuln.summary || "Sin resumen disponible"}</p>
        <h3>Detalles</h3>
        <div class="modal-details">${limpiarTexto(vuln.details)}</div>
        <div class="modal-date">${new Date(vuln.modified).toLocaleDateString("es-AR")}</div>
    `;

    overlay.classList.add("active");
}

document.getElementById("modal-overlay").addEventListener("click", () => {
    document.getElementById("modal-overlay").classList.remove("active");
});

document.getElementById("modal-card").addEventListener("click", e => e.stopPropagation());

/* =========================
   LIMPIO FORMATO MD
========================= */

function limpiarTexto(texto) {

    if (!texto) {
        return "Sin detalles disponibles";
    }

    let limpio = texto;

    // Eliminar links markdown [texto](url)
    let inicio = limpio.indexOf("[");

    while (inicio !== -1) {

        let finTexto = limpio.indexOf("]", inicio);
        let inicioUrl = limpio.indexOf("(", finTexto);
        let finUrl = limpio.indexOf(")", inicioUrl);

        if (
            finTexto !== -1 &&
            inicioUrl !== -1 &&
            finUrl !== -1
        ) {

            let textoLink =
                limpio.substring(
                    inicio + 1,
                    finTexto
                );

            limpio =
                limpio.substring(0, inicio) +
                textoLink +
                limpio.substring(finUrl + 1);

        } else {
            break;
        }

        inicio = limpio.indexOf("[");
    }

    // Eliminar **
    while (limpio.includes("**")) {
        limpio = limpio.replace("**", "");
    }

    // Eliminar *
    while (limpio.includes("*")) {
        limpio = limpio.replace("*", "");
    }

    // Eliminar `
    while (limpio.includes("`")) {
        limpio = limpio.replace("`", "");
    }

    // Eliminar encabezados markdown
    let lineas = limpio.split("\n");

    for (let i = 0; i < lineas.length; i++) {

        while (lineas[i].startsWith("#")) {
            lineas[i] =
                lineas[i].substring(1);
        }

        lineas[i] =
            lineas[i].trimStart();
    }

    limpio = lineas.join("\n");

    return limpio.trim();
}

/* =========================
   HISTORIAL
========================= */

function guardarBusqueda(nombre, version, ecosistema) {

    let historial = JSON.parse(localStorage.getItem("historial")) || [];

    if (
        historial.length &&
        historial.at(-1).nombre === nombre &&
        historial.at(-1).version === version &&
        historial.at(-1).ecosistema === ecosistema
    ) return;

    historial.push({ nombre, version, ecosistema });

    if (historial.length > 10) historial.shift();

    localStorage.setItem("historial", JSON.stringify(historial));

    renderizarHistorial();
}

function renderizarHistorial() {

    const historial = JSON.parse(localStorage.getItem("historial")) || [];

    historyContainer.innerHTML = "";

    if (!historial.length) {
        historyContainer.innerHTML = "<p>Sin búsquedas recientes</p>";
        return;
    }

    for (let i = historial.length - 1; i >= 0; i--) {

        const item = historial[i];

        const div = document.createElement("div");
        div.classList.add("history-item");

        div.textContent =
            item.ecosistema + " • " + item.nombre +
            (item.version ? " " + item.version : "");

        div.addEventListener("click", () => {

            packageName.value = item.nombre;
            packageVersion.value = item.version;
            ecosystemSelect.value = item.ecosistema;

            sidebar.classList.add("collapsed");

            ejecutarBusqueda(item.nombre, item.version, item.ecosistema);
        });

        historyContainer.appendChild(div);
    }
}

document.getElementById("clear-history").addEventListener("click", (e) => {
    e.preventDefault();
    if (!confirm("¿Desea borrar el historial?")) return;
    localStorage.removeItem("historial");
    renderizarHistorial();
});

renderizarHistorial();