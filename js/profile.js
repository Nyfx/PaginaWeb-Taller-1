document.addEventListener("DOMContentLoaded", function () {
    const profileButton = document.getElementById("profileButton");
    const dropdownContent = document.getElementById("dropdown-content");
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const adminLink = document.getElementById("admin-link");
    const userLink = document.getElementById("user-link");

    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let user = JSON.parse(localStorage.getItem('user')) || {};

    function updateUI() {
        console.log('Actualizando UI');
        console.log('isLoggedIn:', isLoggedIn, 'user:', user);
        if (isLoggedIn) {
            loginLink.style.display = "none";
            profileButton.parentElement.style.display = "block";
            logoutLink.style.display = "block";
            if (user.role === "admin") {
                adminLink.style.display = "block";
                userLink.style.display = "none";
            } else if (user.role === "user") {
                userLink.style.display = "block";
                adminLink.style.display = "none";
            }
            profileButton.querySelector('span').textContent = `Bienvenido, ${user.name}`;
        } else {
            loginLink.style.display = "block";
            profileButton.parentElement.style.display = "none";
            logoutLink.style.display = "none";
            adminLink.style.display = "none";
            userLink.style.display = "none";
        }
    }

    function logout() {
        isLoggedIn = false;
        user = {};
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        updateUI();
        window.location.href = '../html/login.html';
    }

    function checkSession() {
        const pathname = window.location.pathname;
        console.log('Verificando sesión');
        console.log('isLoggedIn:', isLoggedIn, 'user:', user, 'pathname:', pathname);
        if (!isLoggedIn) {
            if (pathname.includes('admin.html') || pathname.includes('usuario.html')) {
                window.location.href = '../html/login.html';
            }
        } else {
            if (user.role === 'admin' && pathname.includes('usuario.html')) {
                window.location.href = '../html/admin.html';
            } else if (user.role === 'user' && pathname.includes('admin.html')) {
                window.location.href = '../html/usuario.html';
            }
        }
        updateUI();
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", logout);
    }

    checkSession();
});
