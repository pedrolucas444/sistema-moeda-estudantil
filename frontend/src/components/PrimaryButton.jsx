import React from 'react'

export default function PrimaryButton({ children, className = '', onClick, type = 'button', disabled = false, inline = false }) {
  const base = inline
    ? 'inline-flex items-center gap-2 px-3 py-1 rounded text-white bg-linear-to-r from-blue-800 to-blue-900'
    : 'w-full bg-linear-to-r from-blue-800 to-blue-900 text-white rounded py-2 px-4'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}
