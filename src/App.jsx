import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './Contexts/AuthContext'
import Layout from './Components/Layout/Layout'
import MainPage from './Pages/Main/MainPage'
import BoardPage from './Pages/Board/BoardPage'
import EventsPage from './Pages/Events/EventsPage'
import RankingPage from './Pages/Ranking/RankingPage'
import LoginPage from './Pages/Auth/LoginPage'
import SignupPage from './Pages/Auth/SignupPage'
import LoadingPage from './Components/Common/LoadingPage/LoadingPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />
      },
      {
        path: "board",
        element: <BoardPage />
      },
      {
        path: "events",
        element: <EventsPage />
      },
      {
        path: "ranking",
        element: <RankingPage />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "signup",
        element: <SignupPage />
      }
    ]
  }
])

const App = () => {
  return (
    <AuthProvider>
      <LoadingPage />
      <RouterProvider router={router} />
      <Toaster position="bottom-center" richColors />
    </AuthProvider>
  )
}

export default App
