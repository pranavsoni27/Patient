import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import NotificationDialog from '../components/NotificationDialog';

const Schedule = () => {
  const [formData, setFormData] = useState({
    visitorName: '',
    patientName: '',
    relation: '',
    numVisitors: '',
    appointmentDate: null,
    appointmentTime: null,
    duration: '',
    mode: '',
    photoId: null
  });
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'success'
  });

  // Generate time slots from 9 AM to 9 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      const time = dayjs().hour(hour).minute(0);
      slots.push(time);
      slots.push(time.add(30, 'minute'));
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date
    }));
  };

  const handleTimeChange = (time) => {
    setFormData(prev => ({
      ...prev,
      appointmentTime: time
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setNotification({
          open: true,
          message: 'File size must be less than 5MB',
          type: 'error'
        });
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setNotification({
          open: true,
          message: 'Only .jpg, .jpeg and .png files are allowed',
          type: 'error'
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        photoId: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.photoId) {
      setNotification({
        open: true,
        message: 'Please upload a photo ID',
        type: 'error'
      });
      return;
    }

    if (!formData.appointmentDate || !formData.appointmentTime) {
      setNotification({
        open: true,
        message: 'Please select both date and time',
        type: 'error'
      });
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'appointmentDate') {
        formDataToSend.append(key, formData[key].format('YYYY-MM-DD'));
      } else if (key === 'appointmentTime') {
        formDataToSend.append(key, formData[key].format('HH:mm'));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/meetings/add', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error submitting form');
      }

      setNotification({
        open: true,
        message: 'Appointment request submitted successfully!',
        type: 'success'
      });

      setFormData({
        visitorName: '',
        patientName: '',
        relation: '',
        numVisitors: '',
        appointmentDate: null,
        appointmentTime: null,
        duration: '',
        mode: '',
        photoId: null
      });
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || 'Error submitting form. Please try again.',
        type: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Disable past dates
  const shouldDisableDate = (date) => {
    return dayjs(date).isBefore(dayjs(), 'day');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 4, md: 8 },
          background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
        }}
        className="fade-in"
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
            }}
            className="scale-in"
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                mb: 4,
                fontWeight: 'bold',
                color: '#1a237e'
              }}
            >
              Schedule a Visit
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Visitor Name"
                    name="visitorName"
                    value={formData.visitorName}
                    onChange={handleChange}
                    required
                    className="hover-lift"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Patient Name"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    className="hover-lift"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Relation with Patient"
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                    required
                    className="hover-lift"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Visitors"
                    name="numVisitors"
                    type="number"
                    value={formData.numVisitors}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 1, max: 5 }}
                    className="hover-lift"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Appointment Date"
                    value={formData.appointmentDate}
                    onChange={handleDateChange}
                    shouldDisableDate={shouldDisableDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        className: "hover-lift"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Appointment Time"
                    value={formData.appointmentTime}
                    onChange={handleTimeChange}
                    views={['hours', 'minutes']}
                    minTime={dayjs().hour(9).minute(0)}
                    maxTime={dayjs().hour(21).minute(0)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        className: "hover-lift"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Duration</InputLabel>
                    <Select
                      name="duration"
                      value={formData.duration}
                      label="Duration"
                      onChange={handleChange}
                      className="hover-lift"
                    >
                      <MenuItem value="30min">30 Minutes</MenuItem>
                      <MenuItem value="1hour">1 Hour</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Mode</InputLabel>
                    <Select
                      name="mode"
                      value={formData.mode}
                      label="Mode"
                      onChange={handleChange}
                      className="hover-lift"
                    >
                      <MenuItem value="online">Online</MenuItem>
                      <MenuItem value="offline">Offline</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      sx={{ py: 1.5 }}
                      className="hover-lift"
                    >
                      Upload Photo ID
                    </Button>
                  </label>
                  {formData.photoId && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                      Photo ID uploaded: {formData.photoId.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      mt: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'medium'
                    }}
                    className="hover-lift"
                  >
                    Submit Request
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>

      <NotificationDialog 
        open={notification.open}
        onClose={handleCloseNotification}
        message={notification.message}
        type={notification.type}
      />
    </LocalizationProvider>
  );
};

export default Schedule;
