const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting');

// GET - Get all meetings
router.get('/', async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ createdAt: -1 });
        res.json(meetings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST - Create a new meeting request
router.post('/add', async (req, res) => {
    const upload = req.app.locals.upload.single('photoId');

    upload(req, res, async function(err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const meeting = new Meeting({
            visitorName: req.body.visitorName,
            patientName: req.body.patientName,
            relation: req.body.relation,
            numVisitors: req.body.numVisitors,
            appointmentDate: req.body.appointmentDate,
            appointmentTime: req.body.appointmentTime,
            duration: req.body.duration,
            mode: req.body.mode,
            photoId: req.file ? req.file.filename : null
        });

        try {
            const newMeeting = await meeting.save();
            res.status(201).json(newMeeting);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
});

// PUT - Update meeting status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'approved', 'rejected'].includes(status.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const meeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            { status: status.toLowerCase() },
            { new: true }
        );

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.json(meeting);
    } catch (error) {
        console.error('Error updating meeting status:', error);
        res.status(500).json({ message: 'Error updating meeting status' });
    }
});

// DELETE - Delete a meeting
router.delete('/:id', async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        // Delete the photo file if it exists
        if (meeting.photoId) {
            const fs = require('fs');
            const path = require('path');
            const photoPath = path.join(__dirname, '../uploads', meeting.photoId);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        await meeting.deleteOne();
        res.json({ message: 'Meeting deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
