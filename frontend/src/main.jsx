import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import App from './App.jsx'
import AppWithRedux from './AppWithRedux.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppWithRedux />
  </Provider>
)
