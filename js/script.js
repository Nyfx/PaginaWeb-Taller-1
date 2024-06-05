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
            }, 2000); // Redirigir después de 2 segundos
        } else {
            document.getElementById('mensajeError').innerText = 'Error al iniciar sesión. Por favor, verifica tu nombre de usuario y contraseña.';
            document.getElementById('mensajeError').style.display = 'block'; // Mostrar el mensaje de error en rojo
            
            setTimeout(function() {
                document.getElementById('mensajeError').style.display = 'none'; // Ocultar el mensaje después de 5 segundos
            }, 5000); // Ocultar después de 5 segundos
        }
    })
    .catch(error => console.error('Error:', error));
});
