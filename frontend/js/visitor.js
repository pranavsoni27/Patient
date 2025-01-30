document.addEventListener('DOMContentLoaded', function() {
    const visitorForm = document.getElementById('visitorForm');
    const appointmentDate = document.getElementById('appointmentDate');
    const appointmentTime = document.getElementById('appointmentTime');

    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    appointmentDate.min = `${yyyy}-${mm}-${dd}`;

    // Update time slots based on selected date
    function updateTimeSlots() {
        const selectedDate = new Date(appointmentDate.value);
        const currentDate = new Date();
        const timeSelect = document.getElementById('appointmentTime');
        timeSelect.innerHTML = '<option value="">Select time slot</option>';

        // Generate time slots from 9 AM to 9 PM
        for (let hour = 9; hour <= 21; hour++) {
            const timeValue = `${hour.toString().padStart(2, '0')}:00`;
            
            // If selected date is today, only show future time slots
            if (selectedDate.toDateString() === currentDate.toDateString()) {
                if (hour > currentDate.getHours()) {
                    const option = new Option(`${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`, timeValue);
                    timeSelect.add(option);
                }
            } else {
                const option = new Option(`${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`, timeValue);
                timeSelect.add(option);
            }
        }
    }

    appointmentDate.addEventListener('change', updateTimeSlots);

    // Form submission
    visitorForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('visitorName', document.getElementById('visitorName').value);
        formData.append('patientName', document.getElementById('patientName').value);
        formData.append('relation', document.getElementById('relation').value);
        formData.append('numVisitors', document.getElementById('numVisitors').value);
        formData.append('appointmentDate', document.getElementById('appointmentDate').value);
        formData.append('appointmentTime', document.getElementById('appointmentTime').value);
        formData.append('duration', document.getElementById('duration').value);
        formData.append('mode', document.getElementById('mode').value);
        formData.append('photoId', document.getElementById('photoId').files[0]);

        try {
            const response = await fetch('http://localhost:5000/api/meetings/add', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Disable the submit button
                document.querySelector('button[type="submit"]').disabled = true;
                
                // Show success popup and set timer for redirect
                const { overlay, popup } = showPopup('Meeting request submitted successfully!', 'success');
                
                // Make sure popup is visible
                popup.style.opacity = '1';
                overlay.style.opacity = '1';
                
                // Set a timer to close popup and redirect after 5 seconds
                setTimeout(() => {
                    // Start fade out
                    popup.style.opacity = '0';
                    overlay.style.opacity = '0';
                    
                    // Wait for fade out animation before redirect
                    setTimeout(() => {
                        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                        if (popup && popup.parentNode) popup.parentNode.removeChild(popup);
                        window.location.href = 'index.html';
                    }, 300);
                }, 5000);
            } else {
                showPopup('Error submitting meeting request. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showPopup('Error submitting meeting request. Please try again.', 'error');
        }
    });
});