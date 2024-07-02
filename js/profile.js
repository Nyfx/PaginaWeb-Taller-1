document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.getElementById("profileButton");
    const logoutLink = document.getElementById("logoutLink");
    const loginLink = document.getElementById("login-link");
    const userLink = document.getElementById("user-link");
    const adminLink = document.getElementById("admin-link");

    const userProfileContainer = document.getElementById("userProfileContainer");
    const adminProfileContainer = document.getElementById("adminProfileContainer");
    const showProfileButton = document.getElementById("showProfile");

    // Check login status on page load
    checkLoginStatus();

    // Handle profile button click to show/hide dropdown
    if (profileButton) {
        profileButton.addEventListener("click", toggleDropdown);
    }

    // Handle logout link click
    if (logoutLink) {
        logoutLink.addEventListener("click", handleLogout);
    }

    // Handle show profile button click
    if (showProfileButton) {
        showProfileButton.addEventListener("click", () => {
            const user = JSON.parse(sessionStorage.getItem("user"));
            showProfile(user);
        });
    }

    // Show/hide profile dropdown
    function toggleDropdown() {
        const dropdownMenu = document.querySelector(".dropdown-menu");
        if (dropdownMenu) {
            dropdownMenu.classList.toggle("show");
        }
    }

    // Check login status and update interface
    function checkLoginStatus() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            loginLink.style.display = "none";
            logoutLink.style.display = "block";
            profileButton.innerHTML = `<img src="../img/profile-placeholder.png" class="profile-img" alt="Profile" width="30" height="30"> ${user.nombre}`;

            if (user.rol === "admin") {
                adminLink.style.display = "block";
                userLink.style.display = "block"; // Admins can also access the user panel
            } else {
                adminLink.style.display = "none";
                userLink.style.display = "block";
            }
        } else {
            loginLink.style.display = "block";
            logoutLink.style.display = "none";
            adminLink.style.display = "none";
            userLink.style.display = "none";
        }
    }

    // Handle logout
    function handleLogout(event) {
        event.preventDefault();
        sessionStorage.removeItem("user");
        alert("Sesión cerrada correctamente.");
        window.location.href = "../html/login.html";
    }

    // Show profile based on user role
    function showProfile(user) {
        if (user.rol === "admin") {
            document.getElementById("adminProfileUsername").innerText = user.nickname || user.correo;
            document.getElementById("adminProfileFullName").innerText = `${user.nombre} ${user.apellido}`;
            document.getElementById("adminProfileEmailText").innerText = user.correo;
            document.getElementById("adminUserAgent").innerText = navigator.userAgent;
            document.getElementById("adminUserIP").innerText = "Obteniendo IP...";

            fetch("https://api.ipify.org?format=json")
                .then(response => response.json())
                .then(data => document.getElementById("adminUserIP").innerText = data.ip);

            adminProfileContainer.classList.remove("hidden");
            userProfileContainer.classList.add("hidden");
        } else {
            document.getElementById("profileUsername").innerText = user.nickname || user.correo;
            document.getElementById("profileFullName").innerText = `${user.nombre} ${user.apellido}`;
            document.getElementById("profileEmailText").innerText = user.correo;
            document.getElementById("userAgent").innerText = navigator.userAgent;
            document.getElementById("userIP").innerText = "Obteniendo IP...";

            fetch("https://api.ipify.org?format=json")
                .then(response => response.json())
                .then(data => document.getElementById("userIP").innerText = data.ip);

            userProfileContainer.classList.remove("hidden");
            adminProfileContainer.classList.add("hidden");
        }
    }

    // Redirect to login if unauthorized
    function redirectToLoginIfUnauthorized() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
            window.location.href = "../html/login.html";
        }
    }

    // Check unauthorized access to restricted pages
    const restrictedPages = ["/html/admin.html", "/html/usuario.html"];
    const currentPage = window.location.pathname;
    if (restrictedPages.includes(currentPage)) {
        redirectToLoginIfUnauthorized();
    }
});
