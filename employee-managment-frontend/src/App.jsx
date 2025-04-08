import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OverView from './pages/dashboard/overview/Overview';
import Employees from './pages/dashboard/employees/Employees';
import EditDepartment from './pages/dashboard/overview/EditDepartment';
import Tasks from './pages/dashboard/tasks/Tasks';
import PrivateRoute from './lib/PrivateRoute';
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/employee-managment/" element={<LandingPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        {/* Private Routes */}
          <Route path="/overview" element={<PrivateRoute> <OverView/> </PrivateRoute>} />
          <Route path='/edit-department/:id' element={<PrivateRoute> <EditDepartment/> </PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute> <Employees/> </PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute> <Tasks/> </PrivateRoute>} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
