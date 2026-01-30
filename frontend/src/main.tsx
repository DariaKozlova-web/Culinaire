import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeProvider.tsx'
import './index.css'
import App from './App.tsx'
import AuthContextProvider from "./contexts/AuthContextProvider.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <ThemeProvider>
       <App />
      </ThemeProvider>
    </AuthContextProvider>    
  </StrictMode>,
);
