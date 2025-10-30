import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Root from "@/layouts/Root";
import Layout from "@/components/organisms/Layout";
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
        element: (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center space-y-4">
                <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          }>
            {React.createElement(lazy(() => import('@/components/pages/Login')))}
          </Suspense>
        )
      },
      {
        path: 'signup',
        element: (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center space-y-4">
                <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          }>
            {React.createElement(lazy(() => import('@/components/pages/Signup')))}
          </Suspense>
        )
      },
      {
        path: 'callback',
        element: (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center space-y-4">
                <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          }>
            {React.createElement(lazy(() => import('@/components/pages/Callback')))}
          </Suspense>
        )
      },
      {
        path: 'error',
        element: (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center space-y-4">
                <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          }>
            {React.createElement(lazy(() => import('@/components/pages/ErrorPage')))}
          </Suspense>
        )
      },
      {
        path: 'reset-password/:appId/:fields',
        element: (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center space-y-4">
                <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          }>
            {React.createElement(lazy(() => import('@/components/pages/ResetPassword')))}
          </Suspense>
        )
      },
      {
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center space-y-4">
                <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          }>
            {React.createElement(lazy(() => import('@/components/pages/PromptPassword')))}
          </Suspense>
        )
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