import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Yeh do (2) naye imports add karein
import { store } from './app/store' // Store ka path check kar lein
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)