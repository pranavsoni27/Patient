document.addEventListener('DOMContentLoaded', function() {
    const visitorLoginBtn = document.getElementById('visitorLoginBtn');
    const staffLoginBtn = document.getElementById('staffLoginBtn');
    const loginPage = document.getElementById('loginPage');

    visitorLoginBtn.addEventListener('click', () => {
        window.location.href = 'visitor.html';
    });

    staffLoginBtn.addEventListener('click', () => {
        // Create modal for staff login
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'staffLoginModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Staff Login</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="staffLoginForm">
                            <div class="mb-3">
                                <label for="staffId" class="form-label">Staff ID</label>
                                <input type="text" class="form-control" id="staffId" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Handle staff login form submission
        const staffLoginForm = document.getElementById('staffLoginForm');
        staffLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const staffId = document.getElementById('staffId').value;
            const password = document.getElementById('password').value;

            if (staffId === '1111' && password === '1111') {
                modalInstance.hide();
                showPopup('Login successful!', 'success', 2000);
                setTimeout(() => {
                    window.location.href = 'staff.html';
                }, 2000);
            } else {
                showPopup('Invalid credentials. Please try again.', 'error');
            }
        });

        // Clean up modal when hidden
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    });
});