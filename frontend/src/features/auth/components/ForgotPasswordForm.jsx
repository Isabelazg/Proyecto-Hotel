import { useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { X } from 'lucide-react'

export function ForgotPasswordForm({ onSubmit, isLoading, error }) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  // Validar email en tiempo real
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validar email
    if (!email) {
      setEmailError('El correo electrónico es requerido')
      return
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('El correo electrónico no es válido')
      return
    }
    
    setEmailError('')
    onSubmit({ email })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="email" className="block text-sm font-semibold text-emerald-900 tracking-wide">
          Correo Electrónico
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="tu@ejemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError('')
            }}
            className={`w-full px-4 h-12 rounded-2xl border-2 ${
              emailError || error ? 'border-red-300' : 'border-emerald-200'
            } focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium`}
            required
          />
        </div>
        {/* Mostrar error de validación local */}
        {emailError && (
          <div className="flex items-start gap-2 text-sm text-red-600 mt-1">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{emailError}</span>
          </div>
        )}
        {/* Mostrar error del servidor */}
        {!emailError && error && (
          <div className="flex items-start gap-2 text-sm text-red-600 mt-1">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || !isEmailValid}
        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white font-bold transition-all duration-300 shadow-xl shadow-emerald-900/20 rounded-full tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          'Enviar enlace de recuperación'
        )}
      </Button>
    </form>
  )
}
