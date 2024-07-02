document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");

    showRegister.addEventListener("click", () => toggleSections(registerSection, loginSection));
    showLogin.addEventListener("click", () => toggleSections(loginSection, registerSection));

    loginForm.addEventListener("submit", handleLogin);
    registerForm.addEventListener("submit", handleRegister);

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

    function toggleSections(showSection, hideSection) {
        showSection.classList.remove("d-none");
        hideSection.classList.add("d-none");
    }

    async function handleLogin(event) {
        event.preventDefault();
        const emailOrNickname = document.getElementById("loginEmailOrNickname").value;
        const password = document.getElementById("loginPassword").value;
        const users = await fetchUsers();

        console.log("Users fetched:", users);

        const user = users.find(u => (u.correo === emailOrNickname || u.nickname === emailOrNickname) && u.contrasena === password);
        if (user) {
            alert("Login exitoso!");
            sessionStorage.setItem("user", JSON.stringify(user));
            window.location.href = user.rol === "admin" ? "../html/admin.html" : "../html/usuario.html";
        } else {
            alert("Correo, nickname o contraseña incorrectos.");
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }

    async function handleRegister(event) {
        event.preventDefault();
        const name = document.getElementById("registerName").value;
        const lastName = document.getElementById("registerLastName").value;
        const nickname = document.getElementById("registerNickname").value;
        const email = document.getElementById("registerEmail").value;
        const phone = document.getElementById("registerPhone").value;
        const countryCode = document.getElementById("registerCountryCode").value;
        const password = document.getElementById("registerPassword").value;

        if (!name || !lastName || !nickname || !email || !phone || !password) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Correo electrónico no válido.");
            return;
        }

        if (!validatePassword(password)) {
            alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
            return;
        }

        const users = await fetchUsers();
        if (users.find(u => u.correo === email)) {
            alert("El correo ya está registrado.");
            return;
        }

        const user = {
            nombre: name,
            apellido: lastName,
            nickname: nickname,
            correo: email,
            telefono: phone,
            indicativo_pais: countryCode,
            contrasena: password,
            rol: "usuario"
        };

        users.push(user);
        await saveUsers(users);

        alert("Registro exitoso! Ahora puede iniciar sesión.");
        toggleSections(loginSection, registerSection);
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
});
