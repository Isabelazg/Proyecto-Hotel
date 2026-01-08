import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/auth.api'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const login = async (credentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await loginUser(credentials)
      // Guardar token en localStorage
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return { login, logout, isLoading, error }
}
