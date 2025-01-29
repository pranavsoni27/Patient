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

        const formData = {
            visitorName: document.getElementById('visitorName').value,
            patientName: document.getElementById('patientName').value,
            relation: document.getElementById('relation').value,
            numVisitors: parseInt(document.getElementById('numVisitors').value),
            appointmentDate: document.getElementById('appointmentDate').value,
            appointmentTime: document.getElementById('appointmentTime').value,
            duration: document.getElementById('duration').value,
            mode: document.getElementById('mode').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/meetings/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Meeting request submitted successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Error submitting meeting request. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting meeting request. Please try again.');
        }
    });
});