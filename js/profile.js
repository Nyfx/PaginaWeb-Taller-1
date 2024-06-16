document.addEventListener('DOMContentLoaded', function() {
    const profileButton = document.getElementById('profileButton');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const adminLink = document.getElementById('admin-link');
    const userLink = document.getElementById('user-link');
    const homeLink = document.getElementById('home-link');
    const dropdown = document.getElementById('dropdown');
    const dropdownContent = document.getElementById('dropdown-content');

    function checkUserStatus() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            profileButton.innerHTML = `<img src="img/profile-placeholder.png" class="profile-img" alt="Profile"><span>${user.name}</span> <i class="fa fa-caret-down"></i>`;
            loginLink.style.display = 'none';
            logoutLink.style.display = 'block';
            dropdown.style.display = 'block';
            
            if (user.role === 'admin') {
                adminLink.style.display = 'block';
                userLink.style.display = 'block';  // Mostrar el enlace al panel de usuario también
                homeLink.style.display = 'block';
            } else {
                userLink.style.display = 'block';
                adminLink.style.display = 'none';
                homeLink.style.display = 'block';
            }

            logoutLink.addEventListener('click', function() {
                localStorage.removeItem('user');
                checkUserStatus(); // Recheck user status after logout
                window.location.href = 'html/login.html'; // Asegurar que se redirige al login
            });
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
            adminLink.style.display = 'none';
            userLink.style.display = 'none';
            homeLink.style.display = 'block';
            profileButton.innerHTML = 'Perfil <i class="fa fa-caret-down"></i>';
            dropdown.style.display = 'none';
        }
    }

    function addDefaultAdmin() {
        fetch('json/users.json')
            .then(response => response.json())
            .then(users => {
                localStorage.setItem('users', JSON.stringify(users));
            });
    }

    // Evitar que el dropdown se cierre inmediatamente al seleccionar una opción
    dropdownContent.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    addDefaultAdmin();
    checkUserStatus();
});
