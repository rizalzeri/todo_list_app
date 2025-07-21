import React from 'react';
import { Box, Typography, Button, Paper, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
        main: {
          padding: 0, // Menghilangkan padding pada elemen <main>
        },
      },
    },
  },
});

const Home = () => {
  const router = useRouter();

  const navigateToTasks = () => {
    router.push('/tasks/task_list');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #0F1035, #3A3B5A)',
          color: '#fff',
          padding: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            maxWidth: 800,
            textAlign: 'center',
            backgroundColor: '#ffffff',
            color: '#0F1035',
            borderRadius: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to the To-Do App
          </Typography>
          <Typography variant="h6" component="p" sx={{ marginBottom: 3 }}>
            Your ultimate task management solution! The To-Do App is designed to help you stay organized, productive, 
            and on top of your daily responsibilities. Whether you're managing personal tasks, work projects, or a busy schedule, 
            this app has everything you need to succeed.
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 3 }}>
            With features like task creation, categorization, deadlines, and progress tracking, you can easily manage your workload 
            and achieve your goals. Our intuitive interface ensures a seamless experience, so you can focus on what matters most.
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 4 }}>
            Start organizing your life today and never miss a deadline again. Click the button below to explore your tasks and 
            take the first step toward a more productive you!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={navigateToTasks}
            sx={{
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#0F1035',
              '&:hover': {
                backgroundColor: '#3A3B5A',
              },
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Home;