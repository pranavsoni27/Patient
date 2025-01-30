import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationDialog from '../components/NotificationDialog';

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'error'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userType === 'visitor') {
      localStorage.setItem('userType', 'visitor');
      navigate('/schedule');
      return;
    }

    // Staff credentials check
    if (userType === 'staff' && formData.email === '1111@gmail.com' && formData.password === '1111') {
      localStorage.setItem('userType', 'staff');
      navigate('/appointments');
      return;
    }

    setNotification({
      open: true,
      message: 'Invalid staff credentials. Please try again.',
      type: 'error'
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
        py: { xs: 4, md: 8 }
      }}
      className="fade-in"
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            background: 'rgba(255, 255, 255, 0.95)'
          }}
          className="scale-in"
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: '#1a237e'
            }}
          >
            Login to QuickMeet
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>User Type</InputLabel>
              <Select
                value={userType}
                label="User Type"
                onChange={handleUserTypeChange}
                required
                className="hover-lift"
              >
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="visitor">Visitor</MenuItem>
              </Select>
            </FormControl>

            {userType === 'staff' && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="hover-lift"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="hover-lift"
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'medium'
              }}
              className="hover-lift"
            >
              {userType === 'visitor' ? 'Continue as Visitor' : 'Login'}
            </Button>
          </form>
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

export default Login;
