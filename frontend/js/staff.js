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
                    </div>
                    <div class="d-flex flex-column gap-2">
                        <span class="badge status-${meeting.status.toLowerCase()}">${meeting.status}</span>
                        ${meeting.status === 'pending' ? `
                            <div class="btn-group">
                                <button class="btn btn-sm btn-success" onclick="updateStatus('${meeting._id}', 'approved')">
                                    Approve
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="updateStatus('${meeting._id}', 'rejected')">
                                    Reject
                                </button>
                            </div>
                        ` : ''}
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
                alert('Error updating meeting status');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating meeting status');
        }
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