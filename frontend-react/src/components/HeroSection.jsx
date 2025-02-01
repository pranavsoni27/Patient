import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
        minHeight: { xs: '60vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Container>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', sm: '3.25rem', md: '3.75rem' },
              color: '#1a237e',
              lineHeight: 1.2
            }}
          >
            Schedule Hospital Meetings with Ease
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            paragraph 
            sx={{ 
              mb: 6,
              fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
              lineHeight: 1.6
            }}
          >
            Streamline your hospital appointments and meetings with our efficient scheduling system
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              py: 1.5,
              px: { xs: 4, sm: 6 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
              }
            }}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
