import React from 'react'

export default function ModeSelector({ mode, onModeChange }) {
  const modes = [
    {
      id: 'quick',
      label: 'Quick Answer',
      icon: '⚡',
      description: 'Fast, direct answers'
    },
    {
      id: 'info',
      label: 'Information',
      icon: '📋',
      description: 'Detailed information'
    },
    {
      id: 'guide',
      label: 'Guidance',
      icon: '🧭',
      description: 'Navigate resources'
    }
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Mode:</span>
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onModeChange(m.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200 whitespace-nowrap
            ${mode === m.id
              ? 'bg-portledge-blue-100 text-portledge-blue-700 ring-2 ring-portledge-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          title={m.description}
        >
          <span>{m.icon}</span>
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  )
}
