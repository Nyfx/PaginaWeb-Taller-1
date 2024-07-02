document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || (user.rol !== "usuario" && user.rol !== "admin")) {
        window.location.href = "../html/login.html";
    }

    const sections = {
        form: document.getElementById("userFormContainer"),
        profile: document.getElementById("userProfileContainer"),
        dashboard: document.getElementById("userDashboardContainer"),
        tasks: document.getElementById("userTasksContainer"),
        activity: document.getElementById("userActivityContainer"),
        settings: document.getElementById("userSettingsContainer")
    };

    document.getElementById("showForm").addEventListener("click", () => showSection("form"));
    document.getElementById("showDashboard").addEventListener("click", () => {
        showSection("dashboard");
        loadUserDashboardCharts();
    });
    document.getElementById("showTasks").addEventListener("click", () => showSection("tasks"));
    document.getElementById("showActivity").addEventListener("click", () => showSection("activity"));
    document.getElementById("showSettings").addEventListener("click", () => showSection("settings"));
    document.getElementById("showProfile").addEventListener("click", () => showSection("profile"));

    function showSection(section) {
        Object.values(sections).forEach(s => s.classList.add("hidden"));
        sections[section].classList.remove("hidden");
    }

    const userForm = document.getElementById("userForm");
    userForm.addEventListener("submit", handleFormSubmit);

    function handleFormSubmit(event) {
        event.preventDefault();
        alert("Formulario enviado!");
        userForm.reset();
    }

    function loadUserDashboardCharts() {
        // Mock data for user dashboard charts
        const data1 = {
            labels: ["Task 1", "Task 2", "Task 3"],
            datasets: [{
                label: 'Task Progress',
                data: [65, 59, 80], // Mock data
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
                hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe']
            }]
        };

        const ctx1 = document.getElementById('userChart1').getContext('2d');
        new Chart(ctx1, {
            type: 'bar',
            data: data1,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        const data2 = {
            labels: ["Activity 1", "Activity 2", "Activity 3"],
            datasets: [{
                label: 'Activity Log',
                data: [20, 30, 50], // Mock data
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
                hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe']
            }]
        };

        const ctx2 = document.getElementById('userChart2').getContext('2d');
        new Chart(ctx2, {
            type: 'line',
            data: data2,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Initialize profile information
    if (user) {
        document.getElementById("username").innerText = user.nombre;
        document.getElementById("profileUsername").innerText = user.nickname;
        document.getElementById("profileFullName").innerText = `${user.nombre} ${user.apellido}`;
        document.getElementById("profileEmailText").innerText = user.correo;
        document.getElementById("userAgent").innerText = navigator.userAgent;
        document.getElementById("userIP").innerText = "Obteniendo IP...";

        fetch("https://api.ipify.org?format=json")
            .then(response => response.json())
            .then(data => document.getElementById("userIP").innerText = data.ip);
    }

    // Function to check login status and update UI
    function checkLoginStatus() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const loginLink = document.getElementById("login-link");
        const logoutLink = document.getElementById("logout-link");
        const adminLink = document.getElementById("admin-link");
        const userLink = document.getElementById("user-link");

        if (user) {
            loginLink.style.display = "none";
            logoutLink.style.display = "block";
            document.getElementById("profileButton").innerHTML = `<img src="../img/profile-placeholder.png" class="profile-img" alt="Profile" width="30" height="30"> ${user.nombre}`;

            if (user.rol === "admin") {
                adminLink.style.display = "block";
                userLink.style.display = "block";
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
    document.getElementById("logout-link").addEventListener("click", (event) => {
        event.preventDefault();
        sessionStorage.removeItem("user");
        alert("Sesión cerrada correctamente.");
        window.location.href = "../html/login.html";
    });

    // Verify access to restricted pages
    const restrictedPages = ["/html/admin.html", "/html/usuario.html"];
    const currentPage = window.location.pathname;
    if (restrictedPages.includes(currentPage)) {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
            window.location.href = "../html/login.html";
        }
    }

    // Check login status on page load
    checkLoginStatus();
});
