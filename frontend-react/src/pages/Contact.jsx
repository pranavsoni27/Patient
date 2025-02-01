import { Container, Typography, Box, Grid, Paper, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Contact = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container sx={{ flex: 1, py: 8, mt: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
          Contact Us
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                About Us
              </Typography>
              <Typography paragraph>
                QuickMeet is your trusted healthcare appointment scheduling platform. We're dedicated 
                to making healthcare more accessible by connecting patients with healthcare providers 
                efficiently and seamlessly.
              </Typography>
              <Typography paragraph>
                Our mission is to revolutionize the way healthcare appointments are managed, 
                saving time for both patients and medical staff while ensuring the highest 
                quality of service.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton color="primary" sx={{ mr: 2 }}>
                  <EmailIcon />
                </IconButton>
                <Typography>
                  Email: 1111@gmail.com
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton color="primary" sx={{ mr: 2 }}>
                  <PhoneIcon />
                </IconButton>
                <Typography>
                  Phone: +91 9999999999
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton color="primary" sx={{ mr: 2 }}>
                  <LocationOnIcon />
                </IconButton>
                <Typography>
                  Address: 123 Healthcare Street, Medical District<br />
                  Mumbai, Maharashtra, India
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Office Hours
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Weekdays:
              </Typography>
              <Typography paragraph>
                Monday - Friday: 9:00 AM - 6:00 PM
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Weekends:
              </Typography>
              <Typography paragraph>
                Saturday: 10:00 AM - 2:00 PM<br />
                Sunday: Closed
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
