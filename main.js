// app config
const API = "https://api.lyrics.ovh"

// Eventos del DOM
const search = document.querySelector(".search")
const form = document.querySelector(".form")
const content = document.querySelector(".content")

// Escuchar form submits
form.addEventListener("submit", event => {
    event.preventDefault()

    const ingreseBusqueda = search.value.trim()

    if (!ingreseBusqueda) {
        alert("Ingrese una busqueda válida.")
        return
    }

    buscarCanciones(ingreseBusqueda)
})

// Buscar canciones o artistas
async function buscarCanciones(search) {
    fetch(`${API}/suggest/${search}`)
        .then(response => response.json())
        .then(resultado => {
            console.log(resultado);
            const canciones = resultado;
            mostrarCanciones(canciones);
        })
}

// Mostrar canciones
function mostrarCanciones(canciones) {
    content.innerHTML = `
        <ul class="canciones">
            ${canciones.data.map(cancion => {
                return `<li class="cancion">
                            <img class="avatar" src="${cancion.album.cover}">
                            <span>${cancion.title} by ${cancion.artist.name}</span>
                            <button data-title="${cancion.title}" data-artist="${cancion.artist.name}" class="mostrar">Mostrar letra</button>
                        </li>`
            }).join("")}

            ${ canciones.prev ? `<button onclick="mostrarMasCanciones(${canciones.prev})">Previa</button>` : ""}
            ${ canciones.next ? `<button onclick="mostrarMasCanciones(${canciones.next})">Siguiente</button>` : ""}
        </ul>
    `
}

// Mostrar más canciones
function mostrarMasCanciones(req) {
    console.log(req)
    fetch(req)
        .then(response => response.json())
        .then(resultado => {
            console.log(resultado)
        })
}

content.addEventListener("click", event => {
    if (event.target.tagName === "BUTTON") {
        const element = event.target
        const titulo = element.getAttribute("data-title")
        const artista = element.getAttribute("data-artist")

        obtenerCancion(titulo, artista)
    }
})
// Obtener letra de cancion
function obtenerCancion(titulo, artista) {
    fetch(`${API}/v1/${artista}/${titulo}`)
        .then(response => response.json)
        .then(resultado => {
            console.log(resultado);
            const letra = resultado.letra
            mostarCancion(titulo, artista, letra)
        })
}

// Mostrar letra 
function mostarCancion(titulo, artista, letra) {
    letra = letra.replace(/(\n\r|\n|\r)/g, "<br>")
    content.innerHTML = `
        <h1 class="titulo">${titulo} by ${artista}</h1>
        <p class="letra">
            ${lyric}
        </p>
   `
}

mostrarMasCanciones("http://api.deezer.com/search?limit=15&q=fuel&index=15")
