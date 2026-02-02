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
      // Validar formato de email
      if (!email) {
        throw new Error('El correo electrónico es requerido')
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('El formato del correo electrónico no es válido')
      }
      
      // Aquí irá la llamada a la API cuando el backend esté listo
      // await resetPasswordRequest(email)
      
      // Simulación temporal - validar si el email existe
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulación de validación: solo acepta emails que terminen en @hotel.com
      if (!email.endsWith('@hotel.com')) {
        throw new Error('El correo electrónico no está registrado en el sistema')
      }
      
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Error al enviar el correo de recuperación')
    } finally {
      setIsLoading(false)
    }
  }

  return { sendResetEmail, isLoading, error, success }
}
