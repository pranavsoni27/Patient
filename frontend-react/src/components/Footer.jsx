import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
      className="fade-in"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom className="slide-in delay-1">
              QuickMeet
            </Typography>
            <Typography variant="body2" className="slide-in delay-2" sx={{ opacity: 0.8 }}>
              Streamline your hospital appointments and meetings with our efficient scheduling system.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom className="slide-in delay-1">
              Quick Links
            </Typography>
            <Box className="slide-in delay-2">
              <Link href="/" color="inherit" display="block" sx={{ mb: 1, opacity: 0.8 }} className="hover-lift">
                Home
              </Link>
              <Link href="/about" color="inherit" display="block" sx={{ mb: 1, opacity: 0.8 }} className="hover-lift">
                About
              </Link>
              <Link href="/contact" color="inherit" display="block" sx={{ mb: 1, opacity: 0.8 }} className="hover-lift">
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom className="slide-in delay-1">
              Connect With Us
            </Typography>
            <Box className="slide-in delay-2">
              <IconButton color="inherit" className="hover-scale">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" className="hover-scale">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" className="hover-scale">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" className="hover-scale">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 4,
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}
          className="fade-in delay-3"
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {currentYear} QuickMeet. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
