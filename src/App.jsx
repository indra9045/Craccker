import "./App.css"
import FileUpload from "./Pages/FileUpload.jsx"
import { UserProvider } from "./context/UserContext.jsx"
import SignUp from "./Pages/SignUp.jsx"
import LogIn from "./Pages/LogIn.jsx"
import Nav from "./components/Nav.jsx"
import ForgetPassword from "./Pages/ForgetPassword.jsx"
import Verification from "./Pages/VerificationEmail.jsx"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import LandingPage from "./Pages/HomePage.jsx" // Fixed typo in import path

function NavLayout() {
  return (
    <>
      <Nav />
      <Outlet /> {/* This Outlet is where nested routes (like SignUp) will be rendered */}
    </>
  )
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <UserProvider>
          <NavLayout />
        </UserProvider>
      ),
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/home",
          element: <LandingPage />,
        },
        {
          path: "/login",
          element: <LogIn />,
        },
        {
          path: "/forgetPassword",
          element: <ForgetPassword />,
        },
        {
          path: "/verification",
          element: <Verification />,
        },
        {
          path: "/fileUpload",
          element: <FileUpload />,
        },
      ],
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App

