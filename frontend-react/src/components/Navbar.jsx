import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar, Menu, MenuItem, Slide } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = () => {
  const [userType, setUserType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const checkUserType = () => {
      const storedUserType = localStorage.getItem('userType');
      setUserType(storedUserType);
    };

    checkUserType();
    // Add event listener for storage changes
    window.addEventListener('storage', checkUserType);

    return () => {
      window.removeEventListener('storage', checkUserType);
    };
  }, [location.pathname]); // Re-check when route changes

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    setUserType(null);
    handleClose();
    navigate('/');
  };

  const getHomeRoute = () => {
    if (userType === 'staff') return '/appointments';
    if (userType === 'visitor') return '/schedule';
    return '/';
  };

  return (
    <Slide appear={false} direction="down" in={isVisible}>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={2} 
        sx={{ 
          backgroundColor: 'white',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4 } }}>
          <Toolbar disableGutters>
            <MedicalServicesIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={Link}
              to={getHomeRoute()}
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              QuickMeet
            </Typography>
            <Button component={Link} to={getHomeRoute()} color="inherit" sx={{ mx: 1 }}>
              Home
            </Button>
            <Button component={Link} to="/contact" color="inherit" sx={{ mx: 1 }}>
              Contact
            </Button>
            {userType ? (
              <>
                <Box 
                  onClick={handleProfileClick}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    ml: 2, 
                    cursor: 'pointer',
                    border: '1px solid #e0e0e0',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: userType === 'staff' ? 'primary.main' : 'secondary.main',
                      mr: 1
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Typography sx={{ mr: 1 }}>
                    {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </Typography>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      mt: 1,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1
                      }
                    }
                  }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default Navbar;
