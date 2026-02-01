import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export function CustomSelect({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Seleccionar...",
  className = "",
  error = false,
  required = false 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  const selectedOption = options.find(opt => String(opt.value) === String(value))

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optValue) => {
    onChange(optValue)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-5 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white transition-all duration-300 flex items-center justify-between text-left font-medium ${
          error ? 'border-red-400 bg-red-50/30' : 'border-emerald-200 hover:border-emerald-300'
        } ${className}`}
      >
        <span className={selectedOption ? 'text-gray-700' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-emerald-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-emerald-200 rounded-2xl shadow-2xl shadow-emerald-900/20 max-h-64 overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-2 custom-scrollbar">
            {options.map((option) => {
              const isSelected = String(option.value) === String(value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-5 py-3 text-left transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 font-medium'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

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
