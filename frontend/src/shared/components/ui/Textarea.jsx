export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none ${className}`}
      {...props}
    />
  )
}
