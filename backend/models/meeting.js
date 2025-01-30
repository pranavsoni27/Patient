const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    visitorName: { type: String, required: true },
    patientName: { type: String, required: true },
    relation: { type: String, required: true },
    numVisitors: { type: Number, required: true, min: 1, max: 5 },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    duration: { type: String, required: true },
    mode: { type: String, required: true, enum: ['online', 'offline'] },
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
    photoId: { type: String, required: true }
});

module.exports = mongoose.model('Meeting', meetingSchema);
