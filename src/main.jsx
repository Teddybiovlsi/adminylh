import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import UserLoginForm from './frontend_sys/UserLogin'
import LoginHeader from './shared/LoginHeader'
// import './index.css'
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

ReactDOM.createRoot(document.getElementById('content')).render(
  <React.StrictMode>

    <BrowserView>
      <LoginHeader />
      <UserLoginForm />
    </BrowserView>
    <MobileView>

    </MobileView>

  </React.StrictMode>,
)

