import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="935007080982-t5a18fmj8blgq8tcmttbmsd33lb3dc7s.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>,
)
