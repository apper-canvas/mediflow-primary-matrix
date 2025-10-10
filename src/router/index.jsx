import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from '@/components/organisms/Layout'

// Lazy load page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const Patients = lazy(() => import("@/components/pages/Patients"))
const Appointments = lazy(() => import("@/components/pages/Appointments"))
const Staff = lazy(() => import("@/components/pages/Staff"))
const Departments = lazy(() => import("@/components/pages/Departments"))
const Settings = lazy(() => import("@/components/pages/Settings"))
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
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
]

export const router = createBrowserRouter(routes)