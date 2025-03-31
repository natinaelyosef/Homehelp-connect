"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HomeIcon, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Message } from "@/lib/types"

export default function MessagesPage() {
  // Mock contacts and messages
  const contacts = [
    {
      id: "1",
      name: "Mike's Plumbing",
      lastMessage: "I'll be there tomorrow at 10 AM",
      time: "10:30 AM",
      image: "/placeholder.svg?height=40&width=40",
      unread: true,
    },
    {
      id: "2",
      name: "CleanPro Services",
      lastMessage: "Your booking is confirmed for Friday",
      time: "Yesterday",
      image: "/placeholder.svg?height=40&width=40",
      unread: false,
    },
    {
      id: "3",
      name: "Volt Experts",
      lastMessage: "Do you need any additional services?",
      time: "Yesterday",
      image: "/placeholder.svg?height=40&width=40",
      unread: false,
    },
  ]

  const mockMessages: Message[] = [
    {
      id: "1",
      sender: "Mike's Plumbing",
      content: "Hello! I'm confirming our appointment for tomorrow.",
      timestamp: "10:00 AM",
      read: true,
    },
    {
      id: "2",
      sender: "You",
      content: "Yes, that works for me. What time will you arrive?",
      timestamp: "10:15 AM",
      read: true,
    },
    {
      id: "3",
      sender: "Mike's Plumbing",
      content: "I'll be there around 10 AM. Is that okay?",
      timestamp: "10:20 AM",
      read: true,
    },
    {
      id: "4",
      sender: "You",
      content: "Perfect! I'll be home.",
      timestamp: "10:25 AM",
      read: true,
    },
    {
      id: "5",
      sender: "Mike's Plumbing",
      content: "I'll be there tomorrow at 10 AM",
      timestamp: "10:30 AM",
      read: false,
    },
  ]

  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `${messages.length + 1}`,
      sender: "You",
      content: newMessage,
      timestamp: "Just now",
      read: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="container mx-auto h-screen py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with your service providers</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/homeowner">
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex h-[calc(100vh-200px)] overflow-hidden rounded-lg border">
        {/* Contacts sidebar */}
        <div className="w-1/3 border-r">
          <div className="p-4">
            <Input placeholder="Search conversations..." />
          </div>
          <div className="h-[calc(100%-60px)] overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex cursor-pointer items-center gap-3 border-b p-4 hover:bg-muted ${
                  selectedContact.id === contact.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <Avatar>
                  <AvatarImage src={contact.image} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{contact.lastMessage}</p>
                </div>
                {contact.unread && <div className="h-2 w-2 rounded-full bg-homehelp-600"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex w-2/3 flex-col">
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedContact.image} alt={selectedContact.name} />
                <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedContact.name}</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "You" ? "bg-homehelp-600 text-white" : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`mt-1 text-right text-xs ${
                      message.sender === "You" ? "text-homehelp-100" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

