import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { useLoading } from '../../context/LoadingContext';

export default function GlobalLoading() {
  const { isLoading } = useLoading();

  return (
    <Backdrop
      open={isLoading}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 100, color: '#fff' }}
    >
      <Box textAlign="center">
        <CircularProgress
          sx={{
            color: 'transparent', // Hilangkan warna default
            animation: 'spin 1.5s linear infinite', // Animasi rotasi
            '& .MuiCircularProgress-circle': {
              stroke: 'url(#gradient)', // Gunakan gradasi
            },
          }}
          size={60} // Ukuran spinner
          thickness={4} // Ketebalan spinner
        />
        <svg width="0" height="0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42a5f5" />
              <stop offset="50%" stopColor="#1e88e5" />
              <stop offset="100%" stopColor="#1565c0" />
            </linearGradient>
          </defs>
        </svg>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Please wait...
        </Typography>
      </Box>
    </Backdrop>
  );
}