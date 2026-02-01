import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/Button'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export function LoginForm({ onSubmit, isLoading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email, password, rememberMe })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-3">
        <label htmlFor="email" className="block text-sm font-semibold text-emerald-900 tracking-wide">
          Correo Electrónico
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="tu@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 h-12 rounded-2xl border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium relative z-10"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-emerald-900 tracking-wide">
            Contraseña
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium tracking-wide"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 h-12 rounded-2xl border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none bg-white shadow-sm transition-all duration-300 text-gray-700 font-medium relative z-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-20"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center space-x-3">
        <input
          id="remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 cursor-pointer"
        />
        <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer font-medium tracking-wide">
          Mantener sesión iniciada
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 text-white font-bold transition-all duration-300 shadow-xl shadow-emerald-900/20 rounded-full tracking-wide"
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
            Iniciando sesión...
          </span>
        ) : (
          'Iniciar Sesión'
        )}
      </Button>
    </form>
  )
}
