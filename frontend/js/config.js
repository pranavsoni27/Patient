// Configuration for API endpoints
const config = {
    apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://patient-meeting.onrender.com' // Your Render backend URL
};
