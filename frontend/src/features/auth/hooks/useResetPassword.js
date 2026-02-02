import { useState } from 'react'
import { resetPassword } from '../services/auth.api'

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submitReset = async ({ token, password }) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await resetPassword({ token, contrasena: password })
      setSuccess(true)
    } catch (err) {
      const serverMessage = err.response?.data?.message
      setError(serverMessage || err.message || 'Error al restablecer la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  return { submitReset, isLoading, error, success }
}
