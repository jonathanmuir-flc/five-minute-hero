// Entry point. Vite loads this file from index.html and React takes over
// the <div id="root"> element.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// React pattern: StrictMode renders twice in development to flush out
// side effects. It does nothing in the production build.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
