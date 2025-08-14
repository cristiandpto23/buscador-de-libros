// variables globales para elementos DOM
let autorInput, buscarBtn, resultadosDiv, contadorDiv;

// función principal para buscar libros por autor
async function buscaLibrosPorAutor() {
    const nombreAutor = autorInput.value.trim();

    // validación: verificar que se haya ingresado un autor
    if (!nombreAutor) {
        mostrarError('Por favor, ingrese el nombre de un autor.');
        return;
    }

    // mostrar mensaje de carga
    mostrarCargando();

    // deshabilitar el botón mientras se realiza la búsqueda
    buscarBtn.disabled = true;

    try {
        // realizar la solicitud a la API de Open Library
        const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(nombreAutor)}`;
        const response = await fetch(url);

        // verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();

        // procesar y mostrar los resultados
        mostrarResultados(data);
    } catch (error) {
        console.error('Error al buscar libros:', error);
        mostrarError('Ocurrió un error al buscar los libros. Por favor, inténtelo nuevamente.');
    } finally {
        // re-habilitar el botón
        buscarBtn.disabled = false;
    }
}

// función para mostrar el mensaje de carga
function mostrarCargando() {
    // limpiar contador anterior
    contadorDiv.style.display = 'none';
    contadorDiv.innerHTML = '';

    resultadosDiv.innerHTML = '<div class="cargando">Cargando resultados...</div>';
}

// función para mostrar los resultados
function mostrarResultados(data) {
    // obtener el nombre del autor buscado
    const autorBuscado = autorInput.value.trim();

    // verificar si se encontraron libros
    if (!data.docs || data.docs.length === 0) {
        // ocultar contador si no hay resultados
        contadorDiv.style.display = 'none';
        resultadosDiv.innerHTML = '<div class="sin-resultados">No se encontraron libros para este autor.</div>';
        return;
    }

    // mostrar contador de resultados
    const totalResultados = data.numFound || data.docs.length;
    const resultadosMostrados = Math.min(10, data.docs.length);

    contadorDiv.innerHTML = `
		<div class="contador-info">
			📚 Se encontraron <strong>${totalResultados}</strong> resultados para "<strong>${autorBuscado}</strong>". 
			Mostrando los primeros <strong>${resultadosMostrados}</strong> libros.
		</div>
	`;
    contadorDiv.style.display = 'block';

    // tomar solo los primeros 10 libros
    const libros = data.docs.slice(0, 10);

    // crear HTML para mostrar los resultados
    let htmlResultados = '<div class="lista-libros">';

    libros.forEach((libro) => {
        const titulo = libro.title || 'Título no disponible';
        const año = libro.first_publish_year || 'Año no disponible';
        const autores = libro.author_name ? libro.author_name.join(', ') : 'Autor no disponible';

        htmlResultados += `
			<div class="libro">
				<div class="libro-info">
					<strong>Título:</strong> ${titulo}<br>
					<strong>Año de publicación:</strong> ${año}<br>
					<strong>Autor(es):</strong> ${autores}
				</div>
			</div>
		`;
    });

    htmlResultados += '</div>';
    resultadosDiv.innerHTML = htmlResultados;
}

// función para mostrar errores
function mostrarError(mensaje) {
    // ocultar contador en caso de error
    contadorDiv.style.display = 'none';

    resultadosDiv.innerHTML = `<div class="error">${mensaje}</div>`;
}

// event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar referencias a elementos DOM
    autorInput = document.getElementById('autorInput');
    buscarBtn = document.getElementById('buscarBtn');
    resultadosDiv = document.getElementById('resultados');
    contadorDiv = document.getElementById('contador');

    // agregar evento al botón de búsqueda
    buscarBtn.addEventListener('click', buscaLibrosPorAutor);

    // permitir búsqueda al presionar Enter en el campo de texto
    autorInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            buscaLibrosPorAutor();
        }
    });
});
