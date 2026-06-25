const ecosistemas = {
    npm: {
        nombre: "npm",
        lenguaje: "JavaScript / Node.js",
        instalacion: "npm install express",
        actualizacion: "npm update",
        uso: "Aplicaciones web, APIs, herramientas CLI y servicios backend.",
        sitio: "https://docs.npmjs.com"
    },

    pypi: {
        nombre: "PyPI",
        lenguaje: "Python",
        instalacion: "pip install requests",
        actualizacion: "pip install --upgrade requests",
        uso: "Desarrollo backend, ciencia de datos y automatización.",
        sitio: "https://pypi.org"
    },

    maven: {
        nombre: "Maven",
        lenguaje: "Java",
        instalacion: "Se define en pom.xml",
        actualizacion: "mvn versions:display-dependency-updates",
        uso: "Aplicaciones empresariales Java.",
        sitio: "https://maven.apache.org"
    },

    nuget: {
        nombre: "NuGet",
        lenguaje: ".NET / C#",
        instalacion: "dotnet add package Newtonsoft.Json",
        actualizacion: "dotnet list package --outdated",
        uso: "Aplicaciones .NET y backend.",
        sitio: "https://learn.microsoft.com/nuget"
    },

    go: {
        nombre: "Go Modules",
        lenguaje: "Go",
        instalacion: "go get github.com/gin-gonic/gin",
        actualizacion: "go get -u ./...",
        uso: "Microservicios y APIs de alto rendimiento.",
        sitio: "https://go.dev"
    },

    rubygems: {
        nombre: "RubyGems",
        lenguaje: "Ruby",
        instalacion: "gem install rails",
        actualizacion: "gem update",
        uso: "Desarrollo web con Ruby on Rails.",
        sitio: "https://rubygems.org"
    },

    crates: {
        nombre: "crates.io",
        lenguaje: "Rust",
        instalacion: "cargo add serde",
        actualizacion: "cargo update",
        uso: "Sistemas seguros y software de bajo nivel.",
        sitio: "https://crates.io"
    },

    packagist: {
        nombre: "Packagist",
        lenguaje: "PHP",
        instalacion: "composer require laravel/framework",
        actualizacion: "composer update",
        uso: "Aplicaciones web PHP.",
        sitio: "https://packagist.org"
    },

    hex: {
        nombre: "Hex",
        lenguaje: "Elixir",
        instalacion: "mix deps.get",
        actualizacion: "mix deps.update --all",
        uso: "Sistemas distribuidos y tiempo real.",
        sitio: "https://hex.pm"
    },

    pub: {
        nombre: "Pub",
        lenguaje: "Dart / Flutter",
        instalacion: "flutter pub add http",
        actualizacion: "flutter pub upgrade",
        uso: "Apps móviles multiplataforma.",
        sitio: "https://pub.dev"
    }
};

function mostrarEcosistema(data) {

    const overlay = document.getElementById("modal-overlay");
    const modalCard = document.getElementById("modal-card");

    modalCard.innerHTML = `
        <h2>${data.nombre}</h2>

        <p><strong>Lenguaje:</strong> ${data.lenguaje}</p>

        <p><strong>Instalación:</strong></p>
        <pre class="terminal">${data.instalacion}</pre>

        <p><strong>Actualización:</strong></p>
        <pre class="terminal">${data.actualizacion}</pre>

        <p><strong>Uso principal:</strong> ${data.uso}</p>

        <p>
            <strong>Sitio oficial:</strong>
            <a href="${data.sitio}" target="_blank">${data.sitio}</a>
        </p>
    `;

    overlay.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {

    const botones =
        document.querySelectorAll(".btn-ecosystem");

    botones.forEach(btn => {

        btn.addEventListener("click", () => {

            const id =
                btn.dataset.ecosystem;

            mostrarEcosistema(ecosistemas[id]);
        });
    });
});

const overlay = document.getElementById("modal-overlay");

document.getElementById("close-modal").addEventListener("click", () => {
    overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
});
