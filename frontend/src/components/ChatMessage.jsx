import React from 'react'
import ReactMarkdown from 'react-markdown'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const isError = message.isError

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${isUser ? 'bg-gray-200' : isError ? 'bg-red-100' : 'bg-portledge-blue-100'}
        `}>
          {isUser ? (
            <span className="text-gray-600 font-semibold">You</span>
          ) : (
            <span className={`${isError ? 'text-red-600' : 'text-portledge-blue-600'} font-bold text-lg`}>
              P
            </span>
          )}
        </div>

        {/* Message Content */}
        <div className={`
          flex-1 px-4 py-3 rounded-2xl
          ${isUser 
            ? 'bg-portledge-blue-600 text-white' 
            : isError 
              ? 'bg-red-50 text-red-900 border border-red-200'
              : 'bg-white border border-gray-200'
          }
        `}>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          
          {message.timestamp && (
            <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
              {new Date(message.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
