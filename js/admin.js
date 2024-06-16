document.addEventListener('DOMContentLoaded', function() {
    const userTableBody = document.querySelector('#userTable tbody');
    const formDataTableBody = document.querySelector('#formDataTable tbody');

    function checkAccess() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            window.location.href = '../html/login.html';
        }
    }

    function loadUsers() {
        let localUsers = JSON.parse(localStorage.getItem('users')) || [];
        
        if (localUsers.length === 0) {
            // Load default users if no users in localStorage
            fetch('../json/users.json')
                .then(response => response.json())
                .then(defaultUsers => {
                    localStorage.setItem('users', JSON.stringify(defaultUsers));
                    renderUserTable(defaultUsers);
                })
                .catch(error => {
                    console.error('Error al cargar los usuarios por defecto:', error);
                });
        } else {
            renderUserTable(localUsers);
        }
    }

    function renderUserTable(users) {
        userTableBody.innerHTML = '';
        users.forEach((user, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td contenteditable="true" data-name>${user.name}</td>
                <td contenteditable="true" data-email>${user.email}</td>
                <td contenteditable="true" data-password>${user.password}</td>
                <td>
                    <select data-index="${index}">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td><button data-index="${index}">Eliminar</button></td>
            `;
            userTableBody.appendChild(tr);
        });
    }

    function renderFormDataTable() {
        const formData = JSON.parse(localStorage.getItem('formData')) || [];
        formDataTableBody.innerHTML = '';
        formData.forEach((data, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${data.campo1}</td>
                <td>${data.campo2}</td>
                <td><button data-index="${index}">Eliminar</button></td>
            `;
            formDataTableBody.appendChild(tr);
        });
    }

    userTableBody.addEventListener('change', function(event) {
        if (event.target.tagName === 'SELECT') {
            const index = event.target.getAttribute('data-index');
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users[index].role = event.target.value;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Rol actualizado correctamente');
        }
    });

    userTableBody.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            const index = event.target.getAttribute('data-index');
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            renderUserTable(users);
        }
    });

    userTableBody.addEventListener('input', function(event) {
        const tr = event.target.closest('tr');
        const name = tr.querySelector('[data-name]').innerText;
        const email = tr.querySelector('[data-email]').innerText;
        const password = tr.querySelector('[data-password]').innerText;
        const index = Array.from(userTableBody.children).indexOf(tr);

        let users = JSON.parse(localStorage.getItem('users')) || [];
        users[index].name = name;
        users[index].email = email;
        users[index].password = password;
        localStorage.setItem('users', JSON.stringify(users));
    });

    formDataTableBody.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            const index = event.target.getAttribute('data-index');
            let formData = JSON.parse(localStorage.getItem('formData')) || [];
            formData.splice(index, 1);
            localStorage.setItem('formData', JSON.stringify(formData));
            renderFormDataTable();
        }
    });

    checkAccess();
    loadUsers();
    renderFormDataTable();
});
