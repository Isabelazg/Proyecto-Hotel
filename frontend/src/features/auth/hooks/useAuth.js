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
      // El backend espera 'correo' y 'contrasena', no 'email' y 'password'
      const loginData = {
        correo: credentials.email,
        contrasena: credentials.password
      }
      
      console.log('Intentando login con:', loginData.correo)
      const response = await loginUser(loginData)
      console.log('Respuesta del servidor:', response)
      
      // El backend devuelve { data: { token, usuario } }
      const { token, usuario } = response.data
      
      if (!token) {
        throw new Error('No se recibió token de autenticación')
      }
      
      // Guardar token y datos del usuario en localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(usuario))
      
      console.log('Login exitoso, redirigiendo...')
      // Redirigir al dashboard administrativo
      navigate('/admin', { replace: true })
      
    } catch (err) {
      console.error('Error en login:', err)
      
      let errorMessage = 'Error al iniciar sesión'
      
      if (err.response) {
        // El servidor respondió con un error
        errorMessage = err.response.data?.message || 
                      err.response.data?.errors?.[0]?.detail ||
                      `Error del servidor: ${err.response.status}`
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
      } else {
        // Algo pasó al configurar la petición
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return { login, logout, isLoading, error }
}
