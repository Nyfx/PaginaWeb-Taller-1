document.getElementById('formularioInicioSesion').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener usuario y contraseña del formulario
    var usuario = document.getElementById('usuario').value;
    var contrasena = document.getElementById('contrasena').value;
    
    // Cargar datos de usuario desde el archivo JSON
    fetch('json/usuarios.json')
    .then(response => response.json())
    .then(data => {
        // Verificar si el usuario existe y la contraseña coincide
        var usuarioEncontrado = data.find(user => user.usuario === usuario && user.contrasena === contrasena);
        if (usuarioEncontrado) {
            document.getElementById('mensajeExito').style.display = 'block'; // Mostrar el mensaje de inicio de sesión exitoso
            setTimeout(function() {
                document.getElementById('mensajeExito').style.display = 'none'; // Ocultar el mensaje después de 2 segundos
                if (usuarioEncontrado.rol === 'admin') {
                    window.location.href = 'html/admin.html';
                } else if (usuarioEncontrado.rol === 'usuario') {
                    window.location.href = 'html/usuario.html';
                } else {
                    alert('¡Rol inválido!');
                }
            }, 100); // Redirigir después de (0.9) segundos
        } else {
            document.getElementById('mensajeError').innerText = 'Error al iniciar sesión. Por favor, verifica tu nombre de usuario y contraseña.';
            document.getElementById('mensajeError').style.display = 'block'; // Mostrar el mensaje de error en rojo
            
            setTimeout(function() {
                document.getElementById('mensajeError').style.display = 'none'; // Ocultar el mensaje después de 5 segundos
            }, 500); // Ocultar después de 5 segundos
        }
    })
    .catch(error => console.error('Error:', error));
});

// Función para mostrar la sección seleccionada
function showSection(sectionId) {
    // Oculta todas las secciones
    var sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });

    // Muestra la sección seleccionada
    var section = document.getElementById(sectionId);
    section.style.display = 'block';
}

// Función para mostrar/ocultar el video
function toggleVideo() {
    var videoContainer = document.getElementById("videoContainer");
    if (videoContainer.style.display === "none" || videoContainer.style.display === "") {
        videoContainer.style.display = "block";
    } else {
        videoContainer.style.display = "none";
    }
}

// Muestra la sección de video y mapa por defecto (para pruebas)
document.addEventListener("DOMContentLoaded", function() {
    showSection('video-section');
    showSection('map-section');
});
