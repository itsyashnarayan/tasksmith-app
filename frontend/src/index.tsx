import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import useStore from './store/useStore';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';


const AppWrapper = () => {
  const mode = useStore((s) => s.theme);
  const theme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>       
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
