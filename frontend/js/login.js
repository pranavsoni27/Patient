document.addEventListener('DOMContentLoaded', function() {
    const visitorLoginBtn = document.getElementById('visitorLoginBtn');
    const staffLoginBtn = document.getElementById('staffLoginBtn');

    visitorLoginBtn.addEventListener('click', () => {
        window.location.href = 'visitor.html';
    });

    staffLoginBtn.addEventListener('click', () => {
        window.location.href = 'staff.html';
    });
});