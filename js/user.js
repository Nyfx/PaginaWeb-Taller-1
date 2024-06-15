document.addEventListener('DOMContentLoaded', function() {
    function checkAccess() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'user') {
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

    checkAccess();
});
