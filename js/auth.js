document.getElementById('showRegister').addEventListener('click', function() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('registerSection').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('registerSection').classList.add('hidden');
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Validación de campos vacíos
    if (name.trim() == '' || email.trim() == '' || password.trim() == '') {
        alert("No puede haber ningún campo vacío.");
        return;
    }

    const user = {
        name: name,
        email: email,
        password: password,
        role: 'user'
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Usuario registrado correctamente');
    document.getElementById('showLogin').click();
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Validación de campos vacíos
    if (email.trim() == '' || password.trim() == '') {
        alert("No puede haber ningún campo vacío.");
        return;
    }

    console.log('Iniciando sesión...');
    console.log(`Email: ${email}, Password: ${password}`);

    let users = JSON.parse(localStorage.getItem('users')) || [];

    fetch('../json/users.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(defaultUsers => {
            users = [...defaultUsers, ...users];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('user', JSON.stringify(user));
                alert(`Bienvenido ${user.name}`);
                if (user.role === 'admin') {
                    window.location.href = '../html/admin.html';
                } else {
                    window.location.href = '../html/usuario.html';
                }
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});
