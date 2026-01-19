export function Select({ children, value, onValueChange, ...props }) {
  return (
    <div className="relative">
      {children}
    </div>
  )
}

export function SelectTrigger({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`w-full h-12 px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-500">{placeholder}</span>
}

export function SelectContent({ children }) {
  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
      {children}
    </div>
  )
}

export function SelectItem({ value, children, onClick }) {
  return (
    <div
      onClick={() => onClick?.(value)}
      className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
    >
      {children}
    </div>
  )
}
