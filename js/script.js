document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const profileButton = document.getElementById('profileButton');
    const adminLink = document.getElementById('admin-link');
    const userLink = document.getElementById('user-link');
    const homeLink = document.getElementById('home-link');
    const dropdown = document.getElementById('dropdown');
    const dropdownContent = document.getElementById('dropdown-content');

    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const user = JSON.parse(localStorage.getItem('user'));

    function checkUserStatus() {
        if (isAuthenticated === 'true' && user) {
            profileButton.innerHTML = `<img src="../img/profile-placeholder.png" class="profile-img" alt="Profile"><span>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span> <i class="fa fa-caret-down"></i>`;
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
                localStorage.setItem('isAuthenticated', 'false');
                localStorage.removeItem('user');
                window.location.href = '../html/login.html'; // Asegurar que se redirige al login
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
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const adminEmail = 'guillermo@admin.com';
        const adminPassword = '@dmin12';
        const adminExists = users.some(user => user.email === adminEmail);

        if (!adminExists) {
            users.push({
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Evitar que el dropdown se cierre inmediatamente al seleccionar una opción
    dropdownContent.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    addDefaultAdmin();
    checkUserStatus();
});
