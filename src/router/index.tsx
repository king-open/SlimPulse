import { createBrowserRouter } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
import { AppInitializer } from '../components/AppInitializer'
import Layout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import CheckIn from '../pages/CheckIn'
import Profile from '../pages/Profile'
import Community from '../pages/Community'
import Knowledge from '../pages/Knowledge'
import Achievements from '../pages/Achievements'
import ErrorBoundary, { ErrorFallback } from '../components/ErrorBoundary'
import NotFound from '../pages/NotFound'
import UnderConstruction from '../pages/UnderConstruction'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <AppInitializer>
          <AuthGuard>
            <Layout />
          </AuthGuard>
        </AppInitializer>
      </ErrorBoundary>
    ),
    errorElement: <ErrorFallback />,
    children: [
      { 
        path: '/', 
        element: <Home />,
        errorElement: <ErrorFallback />,
      },
      { 
        path: '/dashboard', 
        element: <Dashboard />,
        errorElement: <ErrorFallback />,
      },
      { 
        path: '/checkin', 
        element: <CheckIn />,
        errorElement: <ErrorFallback />,
      },
      { 
        path: '/profile', 
        element: <UnderConstruction />,
        errorElement: <ErrorFallback />,
      },
      { 
        path: '/community', 
        element: <Community />,
        errorElement: <ErrorFallback />,
      },
      { 
        path: '/knowledge', 
        element: <UnderConstruction />,
        errorElement: <ErrorFallback />,
      },
      { 
        path: '/achievements', 
        element: <Achievements />,
        errorElement: <ErrorFallback />,
      },
      { 
        path: '/settings', 
        element: <UnderConstruction />,
        errorElement: <ErrorFallback />,
      },
    ],
  },
  { 
    path: '/login', 
    element: (
      <ErrorBoundary>
        <AppInitializer>
          <Login />
        </AppInitializer>
      </ErrorBoundary>
    ),
    errorElement: <ErrorFallback />,
  },
  { 
    path: '/register', 
    element: (
      <ErrorBoundary>
        <AppInitializer>
          <Register />
        </AppInitializer>
      </ErrorBoundary>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]) 
