import { LoginForm } from './components/LoginForm'
import { useAuth } from './hooks/useAuth'

export function AuthView() {
  const { login, isLoading, error } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Hotel Login</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <LoginForm onSubmit={login} isLoading={isLoading} />
      </div>
    </div>
  )
}
