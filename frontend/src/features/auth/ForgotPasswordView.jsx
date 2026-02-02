import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import { useForgotPassword } from './hooks/useForgotPassword'

export function ForgotPasswordView() {
  const { sendResetEmail, isLoading, error, success } = useForgotPassword()

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-stone-50 to-emerald-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-block mb-4 px-4 py-1.5 bg-emerald-100/80 backdrop-blur-sm rounded-full border border-emerald-200/50">
              <span className="text-emerald-700 font-medium tracking-wide text-sm">🔐 Recuperación de Cuenta</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4 tracking-tight">
              Recuperar Contraseña
            </h1>
            <p className="text-gray-600 font-light tracking-wide leading-relaxed">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3 shadow-sm">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900 mb-1">¡Correo enviado exitosamente!</p>
                <p className="text-sm text-green-700 font-light">Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
              </div>
            </div>
          )}

          {/* Form */}
          {!success && (
            <ForgotPasswordForm onSubmit={sendResetEmail} isLoading={isLoading} error={error} />
          )}

          {/* Back Button */}
          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium tracking-wide transition-colors"
            >
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950">
        <div className="absolute inset-0 bg-black/30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070)',
          }}
        ></div>
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-emerald-50">
          <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
            Tu seguridad<br />es nuestra prioridad
          </h2>
          <p className="text-xl text-emerald-100 mb-10 font-light tracking-wide leading-relaxed">
            Recupera el acceso a tu cuenta de forma<br />
            rápida y segura en pocos pasos.
          </p>
          
          {/* Security Features */}
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-lime-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
            <p className="text-sm font-light tracking-wide">Proceso seguro y encriptado</p>
          </div>
        </div>
      </div>
    </div>
  )
}
