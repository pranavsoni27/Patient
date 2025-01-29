const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    visitorName: String,
    patientName: String,
    relation: String,
    numVisitors: Number,
    appointmentDate: Date,
    appointmentTime: String,
    duration: String,
    mode: String,
    visitorPhoto: String,  // URL or filename of the uploaded photo
    status: { type: String, default: 'Pending' }, // Accept, Reject, Pending
});

module.exports = mongoose.model('Meeting', meetingSchema);
