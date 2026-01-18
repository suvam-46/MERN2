import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import LoadingScreen from './pages/LoadingScreen'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'

function App () {
  return (
    <div>
      <BrowserRouter>
      <Routes>
       <Route path="/" element={<LoadingScreen />} />
       <Route path="/Login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/ForgotPassword" element={<ForgotPassword />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
