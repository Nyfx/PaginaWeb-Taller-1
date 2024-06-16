document.addEventListener('DOMContentLoaded', function() {
    function checkAccess() {
        let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        let userRole = localStorage.getItem('userRole');

        if (!isLoggedIn || userRole !== 'user') {
            window.location.href = '../html/login.html';
        }
    }

    document.getElementById('userForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const campo1 = document.getElementById('campo1').value;
        const campo2 = document.getElementById('campo2').value;

        const data = {
            campo1: campo1,
            campo2: campo2
        };

        let formData = JSON.parse(localStorage.getItem('formData')) || [];
        formData.push(data);
        localStorage.setItem('formData', JSON.stringify(formData));

        alert('Datos enviados correctamente');
        document.getElementById('userForm').reset();
    });

    document.getElementById('profileForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('profileName').value;
        const email = document.getElementById('profileEmail').value;
        const password = document.getElementById('profilePassword').value;

        let user = JSON.parse(localStorage.getItem('user'));
        let users = JSON.parse(localStorage.getItem('users')) || [];

        user.name = name;
        user.email = email;
        if (password) {
            user.password = password;
        }
        localStorage.setItem('user', JSON.stringify(user));

        let userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }

        alert('Perfil actualizado correctamente');
    });

    function loadProfile() {
        let user = JSON.parse(localStorage.getItem('user'));
        document.getElementById('profileName').value = user.name;
        document.getElementById('profileEmail').value = user.email;
    }

    function loadDashboard() {
        let ctx = document.getElementById('chartContainer').getContext('2d');
        let data = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
            datasets: [{
                label: 'Actividades',
                data: [10, 20, 15, 30, 25],
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    document.getElementById('showForm').addEventListener('click', function() {
        document.getElementById('userFormContainer').classList.remove('hidden');
        document.getElementById('userProfileContainer').classList.add('hidden');
        document.getElementById('userDashboardContainer').classList.add('hidden');
    });

    document.getElementById('showProfile').addEventListener('click', function() {
        document.getElementById('userFormContainer').classList.add('hidden');
        document.getElementById('userProfileContainer').classList.remove('hidden');
        document.getElementById('userDashboardContainer').classList.add('hidden');
    });

    document.getElementById('showDashboard').addEventListener('click', function() {
        document.getElementById('userFormContainer').classList.add('hidden');
        document.getElementById('userProfileContainer').classList.add('hidden');
        document.getElementById('userDashboardContainer').classList.remove('hidden');
    });

    checkAccess();
    loadProfile();
    loadDashboard();
});
