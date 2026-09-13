import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.scss'
import './i18n'
import App from './App'
import { applyStoredTheme } from './common/hooks/useTheme'

// Runs before the first paint so a dark-mode visitor never sees a white flash.
applyStoredTheme()

const rootElement = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
