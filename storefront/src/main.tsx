import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './App.router.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)
