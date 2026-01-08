export function Header() {
  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Hotel Management System</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Admin User</span>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  )
}
