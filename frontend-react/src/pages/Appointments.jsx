import { useState, useEffect, useCallback, memo } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  IconButton,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationDialog from '../components/NotificationDialog';

const AppointmentCard = memo(({ appointment, onStatusChange, onDelete, getStatusColor }) => (
  <Card 
    sx={{ 
      mb: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      },
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Box
          component="img"
          src={appointment.photoId ? `http://localhost:5000/uploads/${appointment.photoId}` : 'https://via.placeholder.com/40?text=No+Photo'}
          alt={`${appointment.visitorName}'s photo ID`}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '4px',
            objectFit: 'cover',
            border: '1px solid #e0e0e0',
            mr: 2
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/40?text=No+Photo';
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {appointment.visitorName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Visiting: {appointment.patientName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Relation: {appointment.relation}
          </Typography>
        </Box>
        <Chip
          label={appointment.status}
          color={getStatusColor(appointment.status)}
          size="small"
          sx={{ ml: 1 }}
        />
      </Box>
      
      <Divider sx={{ my: 1.5 }} />
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        Date: {new Date(appointment.appointmentDate).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Time: {appointment.appointmentTime}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Duration: {appointment.duration}
      </Typography>
      <Typography variant="body2">
        Mode: {appointment.mode}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {appointment.status === 'pending' && (
          <>
            <IconButton
              size="small"
              color="success"
              onClick={() => onStatusChange(appointment._id, 'approved')}
              title="Approve"
            >
              <CheckCircleIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onStatusChange(appointment._id, 'rejected')}
              title="Reject"
            >
              <CancelIcon />
            </IconButton>
          </>
        )}
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(appointment._id)}
          title="Delete"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </CardContent>
  </Card>
));

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'success'
  });

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/meetings', {
        credentials: 'omit',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error loading appointments',
        type: 'error'
      });
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = useCallback(async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/meetings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setNotification({
        open: true,
        message: `Appointment ${newStatus} successfully`,
        type: 'success'
      });
      fetchAppointments();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error updating appointment status',
        type: 'error'
      });
    }
  }, [fetchAppointments]);

  const handleDelete = useCallback(async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/meetings/${id}`, {
        method: 'DELETE',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      setNotification({
        open: true,
        message: 'Appointment deleted successfully',
        type: 'success'
      });
      fetchAppointments();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error deleting appointment',
        type: 'error'
      });
    }
  }, [fetchAppointments]);

  const getStatusColor = useCallback((status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  }, []);

  const getFilteredAppointments = useCallback((status) => {
    return appointments.filter(appointment => appointment.status.toLowerCase() === status.toLowerCase());
  }, [appointments]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 4, md: 8 },
        background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
      }}
      className="fade-in"
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: '#1a237e'
            }}
          >
            Appointments Dashboard
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'warning.50',
                  border: '1px solid',
                  borderColor: 'warning.200',
                  borderRadius: 2,
                  height: '100%',
                  minHeight: 'calc(100vh - 300px)',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'warning.200',
                    borderRadius: '4px',
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid',
                  borderColor: 'warning.main'
                }}>
                  <Typography variant="h6" sx={{ color: 'warning.dark', fontWeight: 'bold', flexGrow: 1 }}>
                    Pending
                  </Typography>
                  <Chip 
                    label={getFilteredAppointments('pending').length}
                    color="warning"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                {getFilteredAppointments('pending').map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    getStatusColor={getStatusColor}
                  />
                ))}
                {getFilteredAppointments('pending').length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    No pending appointments
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'success.50',
                  border: '1px solid',
                  borderColor: 'success.200',
                  borderRadius: 2,
                  height: '100%',
                  minHeight: 'calc(100vh - 300px)',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'success.200',
                    borderRadius: '4px',
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid',
                  borderColor: 'success.main'
                }}>
                  <Typography variant="h6" sx={{ color: 'success.dark', fontWeight: 'bold', flexGrow: 1 }}>
                    Approved
                  </Typography>
                  <Chip 
                    label={getFilteredAppointments('approved').length}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                {getFilteredAppointments('approved').map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    getStatusColor={getStatusColor}
                  />
                ))}
                {getFilteredAppointments('approved').length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    No approved appointments
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'error.50',
                  border: '1px solid',
                  borderColor: 'error.200',
                  borderRadius: 2,
                  height: '100%',
                  minHeight: 'calc(100vh - 300px)',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'error.200',
                    borderRadius: '4px',
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid',
                  borderColor: 'error.main'
                }}>
                  <Typography variant="h6" sx={{ color: 'error.dark', fontWeight: 'bold', flexGrow: 1 }}>
                    Rejected
                  </Typography>
                  <Chip 
                    label={getFilteredAppointments('rejected').length}
                    color="error"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                {getFilteredAppointments('rejected').map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    getStatusColor={getStatusColor}
                  />
                ))}
                {getFilteredAppointments('rejected').length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    No rejected appointments
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <NotificationDialog 
        open={notification.open}
        onClose={handleCloseNotification}
        message={notification.message}
        type={notification.type}
      />
    </Box>
  );
};

export default Appointments;
