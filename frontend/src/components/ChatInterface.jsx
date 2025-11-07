import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import ModeSelector from './ModeSelector'

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m PortledgeAI, your school information assistant. I can help you with questions about teachers, schedules, clubs, events, and school policies. What would you like to know?',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('quick')
  const [suggestions, setSuggestions] = useState([
    "Who teaches Chemistry?",
    "What day is it in the rotation?",
    "Tell me about the Robotics Club"
  ])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call API
      const response = await axios.post('/api/chat', {
        message,
        mode
      }, {
        headers: {
          'Authorization': 'Bearer dev-token' // Temporary for SKIP_AUTH
        }
      })

      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])

      // Update suggestions
      if (response.data.suggestions) {
        setSuggestions(response.data.suggestions)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'I\'m sorry, I encountered an error. Please make sure the backend server is running.',
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Mode Selector */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <ModeSelector mode={mode} onModeChange={setMode} />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-portledge-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-portledge-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-portledge-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {!isLoading && suggestions.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}
