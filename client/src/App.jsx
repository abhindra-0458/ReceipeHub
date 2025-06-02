import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RecipeDetail from './pages/RecipeDetail'
import RecipeForm from './pages/RecipeForm'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/recipes/new" element={<RecipeForm />} />
            <Route path="/recipes/edit/:id" element={<RecipeForm />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App