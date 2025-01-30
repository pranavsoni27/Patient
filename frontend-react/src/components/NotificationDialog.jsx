import { Dialog, DialogContent, Typography, Box, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

const NotificationDialog = ({ open, onClose, message, type = 'success' }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: { xs: '80%', sm: 400 },
          maxWidth: 400,
          p: 2
        }
      }}
    >
      <DialogContent>
        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          pt: 2 
        }}>
          {type === 'success' ? (
            <CheckCircleIcon 
              sx={{ 
                fontSize: 60, 
                color: 'success.main',
                mb: 2 
              }} 
            />
          ) : (
            <ErrorIcon 
              sx={{ 
                fontSize: 60, 
                color: 'error.main',
                mb: 2 
              }} 
            />
          )}
          <Typography 
            variant="h6" 
            component="div" 
            align="center"
            sx={{ 
              color: type === 'success' ? 'success.main' : 'error.main',
              fontWeight: 500 
            }}
          >
            {type === 'success' ? 'Success!' : 'Error'}
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ mt: 1 }}
          >
            {message}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
