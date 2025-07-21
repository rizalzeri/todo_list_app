import Sidebar from '../components/Sidebar';
import '../styles/globals.css';
import '../styles/task_calendar.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { LoadingProvider, useLoading } from '../../context/LoadingContext';
import GlobalLoading from '../components/GlobalLoading';
import Router from 'next/router';

function AppInner({ Component, pageProps }) {
 const { startLoading, stopLoading } = useLoading();

 // 3a. Hook into Next.js route change
 useEffect(() => {
   const onStart = () => startLoading();
   const onDone = () => stopLoading();
   Router.events.on('routeChangeStart', onStart);
   Router.events.on('routeChangeComplete', onDone);
   Router.events.on('routeChangeError', onDone);
   return () => {
     Router.events.off('routeChangeStart', onStart);
     Router.events.off('routeChangeComplete', onDone);
     Router.events.off('routeChangeError', onDone);
   };
 }, [startLoading, stopLoading]);

 // 3b. Override global fetch to auto show loading
 useEffect(() => {
   const originalFetch = window.fetch;
   window.fetch = async (...args) => {
     startLoading();
     try {
       return await originalFetch(...args);
     } finally {
       stopLoading();
     }
   };
   return () => {
     window.fetch = originalFetch;
   };
 }, [startLoading, stopLoading]);

  // tema MUI
  const theme = createTheme({
    palette: {
      secondary: { main: '#092452' },
      info:      { main: '#365486' },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    {/* spinner overlay */}
    <GlobalLoading />

      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1 }}>
          <Component {...pageProps} />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default function App(props) {
  return (
    <LoadingProvider>
      <AppInner {...props} />
    </LoadingProvider>
  );
}
