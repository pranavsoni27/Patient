import { Container, Grid, Typography, Paper, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import HeroSection from '../components/HeroSection';

const features = [
  {
    icon: AccessTimeIcon,
    title: 'Quick Scheduling',
    description: 'Book appointments in minutes with our intuitive interface'
  },
  {
    icon: SecurityIcon,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security'
  },
  {
    icon: DevicesIcon,
    title: 'Access Anywhere',
    description: 'Use our platform on any device, anytime, anywhere'
  }
];

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <HeroSection />
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: { xs: 2, sm: 4, md: 8 },
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        <Container maxWidth={false}>
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
              fontWeight: 'bold',
              color: '#1a237e'
            }}
          >
            Why Choose QuickMeet?
          </Typography>
          <Grid container spacing={4} sx={{ mt: { xs: 2, md: 4 } }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: { xs: 3, sm: 4 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Icon 
                      sx={{ 
                        fontSize: { xs: 40, sm: 48 }, 
                        color: 'primary.main', 
                        mb: 2,
                        p: 1,
                        borderRadius: '50%',
                        backgroundColor: 'primary.light',
                        opacity: 0.8
                      }} 
                    />
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom
                      sx={{
                        fontWeight: 'bold',
                        color: '#1a237e',
                        mb: 2,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
