const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting');

// GET - Get all meetings
router.get('/', async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ appointmentDate: 1, appointmentTime: 1 });
        res.json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Error fetching meetings' });
    }
});

// POST - Create a new meeting request
router.post('/add', async (req, res) => {
    try {
        const { visitorName, patientName, relation, numVisitors, appointmentDate, appointmentTime, duration, mode } = req.body;
        
        // Validate required fields
        if (!visitorName || !patientName || !relation || !appointmentDate || !appointmentTime || !duration || !mode) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate number of visitors
        if (numVisitors < 1 || numVisitors > 5) {
            return res.status(400).json({ message: 'Number of visitors must be between 1 and 5' });
        }

        const newMeeting = new Meeting({
            visitorName,
            patientName,
            relation,
            numVisitors,
            appointmentDate,
            appointmentTime,
            duration,
            mode,
            status: 'pending'
        });

        const savedMeeting = await newMeeting.save();
        res.status(201).json(savedMeeting);
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ message: 'Error creating meeting request' });
    }
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
        const meeting = await Meeting.findByIdAndDelete(req.params.id);
        
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        res.status(500).json({ message: 'Error deleting meeting' });
    }
});

module.exports = router;
