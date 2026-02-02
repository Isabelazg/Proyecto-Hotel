import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { ResetPasswordForm } from './components/ResetPasswordForm'
import { useResetPassword } from './hooks/useResetPassword'

export function ResetPasswordView() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const tokenMissing = !token

  const { submitReset, isLoading, error, success } = useResetPassword()

  const handleSubmit = async ({ password }) => {
    if (!token) return
    await submitReset({ token, password })
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-stone-50 to-emerald-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-block mb-4 px-4 py-1.5 bg-emerald-100/80 backdrop-blur-sm rounded-full border border-emerald-200/50">
              <span className="text-emerald-700 font-medium tracking-wide text-sm">🔐 Restablecer acceso</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4 tracking-tight">
              Restablecer Contraseña
            </h1>
            <p className="text-gray-600 font-light tracking-wide leading-relaxed">
              Crea una nueva contraseña para tu cuenta
            </p>
          </div>

          {tokenMissing && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3 shadow-sm">
              <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">Token inválido</p>
                <p className="text-sm text-red-700 font-light">El enlace no es válido o ha expirado.</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3 shadow-sm">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900 mb-1">¡Contraseña actualizada!</p>
                <p className="text-sm text-green-700 font-light">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              </div>
            </div>
          )}

          {!success && (
            <ResetPasswordForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              tokenMissing={tokenMissing}
            />
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070)',
          }}
        ></div>

        <div className="relative z-10 flex flex-col justify-end p-12 text-emerald-50">
          <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
            Tu cuenta<br />siempre protegida
          </h2>
          <p className="text-xl text-emerald-100 mb-10 font-light tracking-wide leading-relaxed">
            Cambia tu contraseña de forma<br />segura y rápida.
          </p>
        </div>
      </div>
    </div>
  )
}
