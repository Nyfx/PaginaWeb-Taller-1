document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.rol !== "admin") {
        window.location.href = "../html/login.html";
    }

    const sections = {
        users: document.getElementById("usersContainer"),
        formData: document.getElementById("formDataContainer"),
        tasks: document.getElementById("tasksContainer"),
        activities: document.getElementById("activitiesContainer"),
        profile: document.getElementById("adminProfileContainer"),
        serverStats: document.getElementById("serverStatsContainer")
    };

    document.getElementById("showUsers").addEventListener("click", () => showSection("users"));
    document.getElementById("showFormData").addEventListener("click", () => showSection("formData"));
    document.getElementById("showTasks").addEventListener("click", () => showSection("tasks"));
    document.getElementById("showActivities").addEventListener("click", () => showSection("activities"));
    document.getElementById("showProfile").addEventListener("click", () => showSection("profile"));
    document.getElementById("showServerStats").addEventListener("click", () => {
        showSection("serverStats");
        loadServerStats();
    });

    function showSection(section) {
        Object.values(sections).forEach(s => s.classList.add("hidden"));
        sections[section].classList.remove("hidden");
    }

    const userTableBody = document.querySelector("#userTable tbody");
    const formDataTableBody = document.querySelector("#formDataTable tbody");
    const taskForm = document.getElementById("taskForm");
    const activityForm = document.getElementById("activityForm");

    loadUsers();

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Logic to add tasks
    });

    activityForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Logic to add activities
    });

    async function fetchUsers() {
        try {
            const response = await fetch("../json/users.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    }

    async function loadUsers() {
        const users = await fetchUsers();
        console.log("Users fetched:", users);
        users.forEach(user => {
            const row = createUserRow(user);
            userTableBody.appendChild(row);
        });
    }

    function createUserRow(user) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.nombre}</td>
            <td>${user.correo}</td>
            <td>${user.contrasena}</td>
            <td>
                <select class="form-control user-role-select" data-email="${user.correo}">
                    <option value="admin" ${user.rol === "admin" ? "selected" : ""}>Admin</option>
                    <option value="usuario" ${user.rol === "usuario" ? "selected" : ""}>Usuario</option>
                </select>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" data-email="${user.correo}">Eliminar</button>
                <button class="btn btn-primary btn-sm save-role" data-email="${user.correo}">Guardar</button>
            </td>
        `;
        row.querySelector(".btn-danger").addEventListener("click", handleDeleteUser);
        row.querySelector(".save-role").addEventListener("click", handleSaveRole);
        return row;
    }

    async function handleDeleteUser(event) {
        const email = event.target.getAttribute("data-email");
        let users = await fetchUsers();
        users = users.filter(user => user.correo !== email);
        await saveUsers(users);
        event.target.closest("tr").remove();
    }

    async function handleSaveRole(event) {
        const email = event.target.getAttribute("data-email");
        const roleSelect = document.querySelector(`.user-role-select[data-email="${email}"]`);
        const newRole = roleSelect.value;

        let users = await fetchUsers();
        users = users.map(user => {
            if (user.correo === email) {
                return { ...user, rol: newRole };
            }
            return user;
        });

        await saveUsers(users);
        alert(`Role for ${email} updated to ${newRole}`);
    }

    async function saveUsers(users) {
        try {
            await fetch("../json/users.json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(users)
            });
        } catch (error) {
            console.error("Error saving users:", error);
        }
    }

    async function loadServerStats() {
        // Mock server stats data
        const data = {
            labels: ["CPU Usage", "Memory Usage", "Disk Space"],
            datasets: [{
                label: 'Server Usage',
                data: [65, 59, 80], // Mock data
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
                hoverBackgroundColor: ['#ff6384', '#36a2eb', '#cc65fe']
            }]
        };

        const ctx = document.getElementById('serverStatsChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Show the users section by default
    showSection("users");
});
