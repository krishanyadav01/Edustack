import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { appStore } from './app/store'
import { Toaster } from 'sonner'
import { useLoadUserQuery } from './features/api/authApi'
import LoadingSpinner from './components/LoadingSpinner'
import { ThemeProvider } from './components/ThemeProvider'


const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return (
    <>
      {
        isLoading ? <LoadingSpinner/> : <>{children}</>
      }
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <ThemeProvider>
        <Toaster richColors />
        <Custom>
          <App />
        </Custom>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
