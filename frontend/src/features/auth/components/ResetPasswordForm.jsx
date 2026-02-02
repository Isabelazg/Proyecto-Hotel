import { useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { X } from 'lucide-react'

export function ResetPasswordForm({ onSubmit, isLoading, error, tokenMissing }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (tokenMissing) return

    if (!password) {
      setFormError('La contraseña es requerida')
      return
    }

    if (password.length < 8) {
      setFormError('La contraseña debe tener mínimo 8 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden')
      return
    }

    setFormError('')
    onSubmit({ password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="password" className="block text-sm font-semibold text-emerald-900 tracking-wide">
          Nueva Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setFormError('')
          }}
          className={`w-full px-4 h-12 rounded-2xl border-2 ${
            formError || error ? 'border-red-300' : 'border-emerald-200'
          } focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium`}
          required
          disabled={tokenMissing}
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-emerald-900 tracking-wide">
          Confirmar Contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setFormError('')
          }}
          className={`w-full px-4 h-12 rounded-2xl border-2 ${
            formError || error ? 'border-red-300' : 'border-emerald-200'
          } focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium`}
          required
          disabled={tokenMissing}
        />
      </div>

      {formError && (
        <div className="flex items-start gap-2 text-sm text-red-600 mt-1">
          <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {!formError && error && (
        <div className="flex items-start gap-2 text-sm text-red-600 mt-1">
          <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || tokenMissing}
        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white font-bold transition-all duration-300 shadow-xl shadow-emerald-900/20 rounded-full tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
      </Button>
    </form>
  )
}
