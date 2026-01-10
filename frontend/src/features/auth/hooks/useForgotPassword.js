import { useState } from 'react'

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const sendResetEmail = async ({ email }) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Aquí irá la llamada a la API
      // await resetPasswordRequest(email)
      
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Error al enviar el correo')
    } finally {
      setIsLoading(false)
    }
  }

  return { sendResetEmail, isLoading, error, success }
}
