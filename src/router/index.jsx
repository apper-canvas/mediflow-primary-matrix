import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from '@/components/organisms/Layout'
import Root from '@/layouts/Root'
import { getRouteConfig } from './route.utils'

// Lazy load page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const Patients = lazy(() => import("@/components/pages/Patients"))
const Appointments = lazy(() => import("@/components/pages/Appointments"))
const Staff = lazy(() => import("@/components/pages/Staff"))
const Departments = lazy(() => import("@/components/pages/Departments"))
const Settings = lazy(() => import("@/components/pages/Settings"))
const Bills = lazy(() => import("@/components/pages/Bills"))
const LabTests = lazy(() => import("@/components/pages/LabTests"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Dashboard />
      </Suspense>
    )
  },
  {
    path: "patients",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Patients />
      </Suspense>
    )
  },
  {
    path: "appointments",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Appointments />
      </Suspense>
    )
  },
  {
    path: "staff",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Staff />
      </Suspense>
    )
  },
  {
    path: "departments",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Departments />
      </Suspense>
    )
},
  {
    path: "lab-tests",
    element: <Suspense fallback={<div>Loading.....</div>}><LabTests /></Suspense>
  },
  {
    path: "bills",
    element: <Suspense fallback={<div>Loading.....</div>}><Bills /></Suspense>,
  },
  {
    path: "settings",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Settings />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
]

const routes = [
  {
path: '/',
    element: <Root />,
    children: [
      {
        path: 'login',
        element: lazy(() => import('@/components/pages/Login'))
      },
      {
        path: 'signup',
        element: lazy(() => import('@/components/pages/Signup'))
      },
      {
        path: 'callback',
        element: lazy(() => import('@/components/pages/Callback'))
      },
      {
        path: 'error',
        element: lazy(() => import('@/components/pages/ErrorPage'))
      },
      {
        path: 'reset-password/:appId/:fields',
        element: lazy(() => import('@/components/pages/ResetPassword'))
      },
      {
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: lazy(() => import('@/components/pages/PromptPassword'))
      },
      {
        path: '/',
        element: <Layout />,
        children: [...mainRoutes]
      }
    ]
  }
]

export const router = createBrowserRouter(routes)