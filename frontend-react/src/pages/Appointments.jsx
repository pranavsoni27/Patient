import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationDialog from '../components/NotificationDialog';

const AppointmentCard = memo(({ appointment, onStatusChange, onDelete, getStatusColor }) => (
  <Card 
    sx={{ 
      mb: 2,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      '&:hover': {
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)',
      },
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'visible',
      borderRadius: '12px',
      bgcolor: 'background.paper'
    }}
  >
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Box
          component="img"
          src={appointment.photoId ? `http://localhost:5000/uploads/${appointment.photoId}` : 'https://via.placeholder.com/50?text=No+Photo'}
          alt={`${appointment.visitorName}'s photo ID`}
          sx={{
            width: 50,
            height: 50,
            borderRadius: '8px',
            objectFit: 'cover',
            border: '2px solid',
            borderColor: 'primary.light',
            mr: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/50?text=No+Photo';
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'primary.main' }}>
            {appointment.visitorName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 0.5, color: 'text.primary' }}>
            Visiting: {appointment.patientName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Relation: {appointment.relation}
          </Typography>
        </Box>
        <Chip
          label={appointment.status}
          color={getStatusColor(appointment.status)}
          sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            fontWeight: 600,
            textTransform: 'capitalize',
            minWidth: '90px',
            height: '28px',
            '& .MuiChip-label': {
              px: 2
            }
          }}
        />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" sx={{ 
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            '&:before': {
              content: '"📅"',
              marginRight: '8px'
            }
          }}>
            Date: {new Date(appointment.appointmentDate).toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" sx={{ 
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            '&:before': {
              content: '"⏰"',
              marginRight: '8px'
            }
          }}>
            Time: {appointment.appointmentTime}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" sx={{ 
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            '&:before': {
              content: '"⌛"',
              marginRight: '8px'
            }
          }}>
            Duration: {appointment.duration}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" sx={{ 
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            '&:before': {
              content: '"🏥"',
              marginRight: '8px'
            }
          }}>
            Mode: {appointment.mode}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 1,
        mt: 'auto',
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        {appointment.status === 'pending' && (
          <>
            <IconButton
              color="success"
              onClick={() => onStatusChange(appointment._id, 'approved')}
              title="Approve"
              sx={{ 
                '&:hover': { 
                  transform: 'scale(1.1)',
                  bgcolor: 'success.light'
                }
              }}
            >
              <CheckCircleIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => onStatusChange(appointment._id, 'rejected')}
              title="Reject"
              sx={{ 
                '&:hover': { 
                  transform: 'scale(1.1)',
                  bgcolor: 'error.light'
                }
              }}
            >
              <CancelIcon />
            </IconButton>
          </>
        )}
        <IconButton
          color="error"
          onClick={() => onDelete(appointment._id)}
          title="Delete"
          sx={{ 
            '&:hover': { 
              transform: 'scale(1.1)',
              bgcolor: 'error.light'
            }
          }}
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
    type: 'info'
  });

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/meetings');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/meetings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchAppointments();
      setNotification({
        open: true,
        message: `Appointment ${newStatus} successfully`,
        type: 'success'
      });
    } catch (err) {
      console.error('Error updating status:', err);
      setNotification({
        open: true,
        message: 'Error updating appointment status',
        type: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/meetings/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      await fetchAppointments();
      setNotification({
        open: true,
        message: 'Appointment deleted successfully',
        type: 'success'
      });
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setNotification({
        open: true,
        message: 'Error deleting appointment',
        type: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getFilteredAppointments = useCallback((status) => {
    return appointments.filter(appointment => appointment.status.toLowerCase() === status.toLowerCase());
  }, [appointments]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
      }}
    >
      <Container maxWidth="xl">
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            color: 'primary.main',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Appointments Dashboard
        </Typography>

        <Grid container spacing={4}>
          {['Pending', 'Approved', 'Rejected'].map((status) => (
            <Grid item xs={12} md={4} key={status}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  height: '100%',
                  bgcolor: status.toLowerCase() === 'pending' ? 'warning.50' 
                    : status.toLowerCase() === 'approved' ? 'success.50'
                    : 'error.50',
                  border: '1px solid',
                  borderColor: status.toLowerCase() === 'pending' ? 'warning.200'
                    : status.toLowerCase() === 'approved' ? 'success.200'
                    : 'error.200'
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  pb: 2,
                  borderBottom: '2px solid',
                  borderColor: status.toLowerCase() === 'pending' ? 'warning.main'
                    : status.toLowerCase() === 'approved' ? 'success.main'
                    : 'error.main'
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: status.toLowerCase() === 'pending' ? 'warning.dark'
                        : status.toLowerCase() === 'approved' ? 'success.dark'
                        : 'error.dark',
                      flexGrow: 1
                    }}
                  >
                    {status}
                  </Typography>
                  <Chip
                    label={getFilteredAppointments(status).length}
                    color={getStatusColor(status)}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Box sx={{ 
                  maxHeight: 'calc(100vh - 300px)',
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: status.toLowerCase() === 'pending' ? 'warning.main'
                      : status.toLowerCase() === 'approved' ? 'success.main'
                      : 'error.main',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: status.toLowerCase() === 'pending' ? 'warning.dark'
                        : status.toLowerCase() === 'approved' ? 'success.dark'
                        : 'error.dark'
                    }
                  }
                }}>
                  {getFilteredAppointments(status).map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                  {getFilteredAppointments(status).length === 0 && (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        textAlign: 'center',
                        color: 'text.secondary',
                        py: 4
                      }}
                    >
                      No {status.toLowerCase()} appointments
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <NotificationDialog
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  );
};

export default Appointments;
