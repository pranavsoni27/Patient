document.addEventListener('DOMContentLoaded', function() {
    let currentFilter = 'all';
    const meetingsList = document.getElementById('meetingsList');
    const filterButtons = document.querySelectorAll('[data-filter]');

    // Fetch and display meetings
    async function fetchMeetings() {
        try {
            const response = await fetch('http://localhost:5000/api/meetings');
            const meetings = await response.json();
            displayMeetings(meetings);
        } catch (error) {
            console.error('Error fetching meetings:', error);
            meetingsList.innerHTML = '<div class="alert alert-danger">Error loading meetings</div>';
        }
    }

    // Display meetings based on filter
    function displayMeetings(meetings) {
        meetingsList.innerHTML = '';
        
        const filteredMeetings = meetings.filter(meeting => {
            if (currentFilter === 'all') return true;
            return meeting.status.toLowerCase() === currentFilter;
        });

        if (filteredMeetings.length === 0) {
            meetingsList.innerHTML = '<div class="alert alert-info">No meetings found</div>';
            return;
        }

        filteredMeetings.forEach(meeting => {
            const meetingDate = new Date(meeting.appointmentDate);
            const card = document.createElement('div');
            card.className = 'list-group-item';
            card.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">${meeting.visitorName} → ${meeting.patientName}</h5>
                        <p class="mb-1">
                            <small>
                                ${meetingDate.toLocaleDateString()} at ${meeting.appointmentTime}
                                (${meeting.duration} minutes) - ${meeting.mode}
                            </small>
                        </p>
                        <p class="mb-1">Visitors: ${meeting.numVisitors} | Relation: ${meeting.relation}</p>
                        ${meeting.photoId ? `
                            <img src="http://localhost:5000/uploads/${meeting.photoId}" 
                                alt="Photo ID" 
                                class="img-thumbnail mt-2" 
                                style="max-width: 150px; cursor: pointer"
                                onclick="window.open(this.src, '_blank')"
                            >
                        ` : ''}
                    </div>
                    <div class="d-flex flex-column gap-2">
                        <span class="badge status-${meeting.status.toLowerCase()}">${meeting.status}</span>
                        <div class="btn-group">
                            ${meeting.status === 'pending' ? `
                                <button class="btn btn-sm btn-success" onclick="updateStatus('${meeting._id}', 'approved')">
                                    Approve
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="updateStatus('${meeting._id}', 'rejected')">
                                    Reject
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteMeeting('${meeting._id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            meetingsList.appendChild(card);
        });
    }

    // Update meeting status
    window.updateStatus = async function(meetingId, status) {
        try {
            const response = await fetch(`http://localhost:5000/api/meetings/${meetingId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                fetchMeetings();
            } else {
                showPopup('Error updating meeting status', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showPopup('Error updating meeting status', 'error');
        }
    };

    // Delete meeting
    window.deleteMeeting = async function(meetingId) {
        const { overlay, popup } = showPopup('Are you sure you want to delete this meeting request?', 'error');
        
        // Add confirm and cancel buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex justify-content-center gap-2 mt-3';
        
        const confirmButton = document.createElement('button');
        confirmButton.className = 'btn btn-danger';
        confirmButton.textContent = 'Delete';
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-secondary';
        cancelButton.textContent = 'Cancel';
        
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
        popup.appendChild(buttonContainer);
        
        // Handle cancel
        cancelButton.onclick = () => closePopup(overlay, popup);
        
        // Handle confirm
        confirmButton.onclick = async () => {
            closePopup(overlay, popup);
            
            try {
                const response = await fetch(`http://localhost:5000/api/meetings/${meetingId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const { overlay, popup } = showPopup('Meeting deleted successfully', 'success');
                    
                    // Make sure popup is visible
                    popup.style.opacity = '1';
                    overlay.style.opacity = '1';
                    
                    // Set a timer to close popup and refresh after 5 seconds
                    setTimeout(() => {
                        // Start fade out
                        popup.style.opacity = '0';
                        overlay.style.opacity = '0';
                        
                        // Wait for fade out animation before refreshing
                        setTimeout(() => {
                            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                            if (popup && popup.parentNode) popup.parentNode.removeChild(popup);
                            fetchMeetings();
                        }, 300);
                    }, 5000);
                } else {
                    showPopup('Error deleting meeting request', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showPopup('Error deleting meeting request', 'error');
            }
        };
    };

    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            fetchMeetings();
        });
    });

    // Initial fetch
    fetchMeetings();
});