import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import { useForgotPassword } from './hooks/useForgotPassword'

export function ForgotPasswordView() {
  const { sendResetEmail, isLoading, error, success } = useForgotPassword()

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowLeft size={16} />
            Volver al inicio de sesión
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-gray-800 mb-3">
              Recuperar Contraseña
            </h1>
            <p className="text-gray-600">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <CheckCircle size={18} />
              <span className="text-sm">
                ¡Correo enviado! Revisa tu bandeja de entrada.
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          {!success && (
            <ForgotPasswordForm onSubmit={sendResetEmail} isLoading={isLoading} />
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-900 to-amber-950">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070)',
          }}
        ></div>
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <h2 className="text-5xl font-serif font-bold mb-4">
            Tu seguridad<br />es nuestra prioridad
          </h2>
          <p className="text-lg text-gray-200 max-w-md">
            Recupera el acceso a tu cuenta de forma rápida y segura
          </p>
        </div>
      </div>
    </div>
  )
}
