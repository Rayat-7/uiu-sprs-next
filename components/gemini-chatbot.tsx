"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  FileText, 
  ExternalLink, 
  Sparkles,
  MessageCircle,
  HelpCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  quickActions?: QuickAction[]
  isTyping?: boolean
}

interface QuickAction {
  label: string
  action: 'navigate' | 'chat'
  url?: string
  message?: string
}

const quickStartQuestions = [
  "How do I submit a report?",
  "What are the reporting rules?",
  "How can I track my reports?",
  "What file formats can I upload?",
  "How long does resolution take?",
  "Can I submit multiple reports?"
]

const welcomeQuickActions: QuickAction[] = [
  { label: "Submit Report", action: "navigate", url: "/dashboard/student" },
  { label: "View Dashboard", action: "navigate", url: "/dashboard/student" },
  { label: "Learn Rules", action: "chat", message: "What are the rules for reporting?" },
  { label: "Get Help", action: "chat", message: "I need help with the system" }
]

export function GeminiChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your UIUSPRS AI Assistant powered by Gemini. I can help you with reporting procedures, rules, tracking, and answer any questions about the system. What would you like to know?",
      timestamp: new Date(),
      quickActions: welcomeQuickActions
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim()
    if (!content || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await fetch('/api/chatbot/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversation: messages.slice(-5) // Send last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Remove typing indicator and add response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing')
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.response,
          timestamp: new Date(),
          quickActions: data.quickActions || []
        }
        return [...filtered, botMessage]
      })

    } catch (error) {
      console.error('Chatbot error:', error)
      
      // Remove typing indicator and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing')
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I apologize, but I'm having trouble connecting right now. Here are some quick help topics:\n\n• Submit reports in Student Dashboard\n• One report per week limit\n• Use UIU email format\n• Check report status in dashboard\n\nPlease try again in a moment!",
          timestamp: new Date(),
          quickActions: [
            { label: "Go to Dashboard", action: "navigate", url: "/dashboard/student" }
          ]
        }
        return [...filtered, errorMessage]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    if (action.action === 'navigate' && action.url) {
      window.location.href = action.url
    } else if (action.action === 'chat' && action.message) {
      handleSendMessage(action.message)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-orange-600 via-red-700 to-orange-700 text-white p-4 rounded-none">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">UIUSPRS AI Assistant</CardTitle>
            <p className="text-xs text-blue-100 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Powered by Gemini AI
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {message.isTyping ? (
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && <Bot className="w-4 h-4 mt-1 text-blue-600 flex-shrink-0" />}
                      {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    {message.quickActions && message.quickActions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium opacity-80">Quick actions:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {message.quickActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuickAction(action)}
                              className="text-xs h-8 px-2 bg-white/10 hover:bg-white/20 justify-start border border-white/20"
                            >
                              {action.action === 'navigate' ? (
                                <ExternalLink className="w-3 h-3 mr-1" />
                              ) : (
                                <MessageCircle className="w-3 h-3 mr-1" />
                              )}
                              <span className="truncate">{action.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Quick Questions */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-1">
          {quickStartQuestions.slice(0, 2).map((question, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors text-xs py-1 px-2"
              onClick={() => handleSendMessage(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about UIUSPRS..."
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}