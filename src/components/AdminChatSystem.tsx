"use client"
/* eslint-disable react/prop-types */

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { Paperclip, X, MessageSquarePlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface User {
  _id: string
  username: string
  email: string
}

interface Message {
  _id: string
  senderId: string
  senderName: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  attachment?: {
    filename: string
    contentType: string
    url: string
  }
}

interface AdminMessageSystemProps {
  onUnreadMessagesChange: (count: number) => void
}

const AdminMessageSystem: React.FC<AdminMessageSystemProps> = ({ onUnreadMessagesChange }) => {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [attachment, setAttachment] = useState<File | null>(null)
  const [attachmentName, setAttachmentName] = useState<string | null>(null)
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false)
  const lastMessageTimestampRef = useRef<Date | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<{ [userId: string]: number }>({})

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return

    try {
      const url = `/api/messages?userId=${selectedUser._id}`
      const response = await fetch(url)
      if (response.ok) {
        const data: Message[] = await response.json()
        const filteredMessages = data.filter(
          (message) => message.senderId === selectedUser._id || message.receiverId === selectedUser._id,
        )
        setMessages(filteredMessages)
        const newUnreadMessages = filteredMessages.filter(
          (message) =>
            message.senderId === selectedUser._id &&
            !message.read &&
            (!lastMessageTimestampRef.current || new Date(message.timestamp) > lastMessageTimestampRef.current),
        )
        if (newUnreadMessages.length > 0) {
          onUnreadMessagesChange(newUnreadMessages.length)
          lastMessageTimestampRef.current = new Date(
            Math.max(...newUnreadMessages.map((m) => new Date(m.timestamp).getTime())),
          )

          // Show toast notification for new messages
          toast({
            title: "New Message",
            description: `You have ${newUnreadMessages.length} new message(s) from ${selectedUser.username || selectedUser.email}`,
          })

          // Update unread count for the selected user
          setUnreadCounts((prev) => ({
            ...prev,
            [selectedUser._id]: (prev[selectedUser._id] || 0) + newUnreadMessages.length,
          }))
        }

        // Mark messages as read
        if (newUnreadMessages.length > 0) {
          await fetch("/api/messages/mark-read", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messageIds: newUnreadMessages.map((m) => m._id),
            }),
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch messages. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to fetch messages. Please try again.",
        variant: "destructive",
      })
    }
  }, [selectedUser, onUnreadMessagesChange])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [fetchMessages, selectedUser])

  const handleNewChat = (user: User) => {
    setSelectedUser(user)
    setIsNewChatDialogOpen(false)
    setMessages([])
    lastMessageTimestampRef.current = null
    // Reset unread count for the selected user
    setUnreadCounts((prev) => ({ ...prev, [user._id]: 0 }))
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() && !attachment) return
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user to chat with.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("content", newMessage)
    formData.append("senderId", session?.user?.id || "")
    formData.append("senderName", session?.user?.name || session?.user?.email || "")
    formData.append("receiverId", selectedUser._id)

    if (attachment) {
      formData.append("attachment", attachment)
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }

      setNewMessage("")
      setAttachment(null)
      setAttachmentName(null)
      await fetchMessages()
      toast({
        title: "Success",
        description: "Message sent successfully.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0])
      setAttachmentName(e.target.files[0].name)
    } else {
      setAttachment(null)
      setAttachmentName(null)
    }
  }

  const removeAttachment = () => {
    setAttachment(null)
    setAttachmentName(null)
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const MessageBubble = React.memo(({ message }: { message: Message }) => {
    const isOwnMessage = message.senderId === session?.user?.id

    return (
      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`max-w-[70%] p-3 rounded-lg ${isOwnMessage ? "bg-blue-100" : "bg-gray-100"}`}>
          <div className="flex justify-between items-start mb-1">
            <span className="font-semibold text-sm">{isOwnMessage ? "You" : message.senderName}</span>
            <span className="text-xs text-gray-500 ml-2">{formatDate(message.timestamp)}</span>
          </div>
          <p className="text-sm break-words">{message.content}</p>
          {message.attachment && (
            <div className="mt-2">
              <a
                href={message.attachment.url}
                download={message.attachment.filename}
                className="text-blue-500 underline text-sm flex items-center"
              >
                <Paperclip className="h-4 w-4 mr-1" />
                {message.attachment.filename}
              </a>
            </div>
          )}
        </div>
      </div>
    )
  })

  MessageBubble.displayName = "MessageBubble"

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {selectedUser
            ? `Chat with ${selectedUser.username || selectedUser.email}`
            : "Select a user to start chatting"}
        </CardTitle>
        <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a user to start a new chat</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              {users.map((user) => (
                <Button
                  key={user._id}
                  onClick={() => handleNewChat(user)}
                  className="w-full mb-2 justify-start relative"
                  variant="outline"
                >
                  {user.username || user.email}
                  {unreadCounts[user._id] > 0 && (
                    <Badge variant="destructive" className="ml-2 absolute right-2">
                      {unreadCounts[user._id]}
                    </Badge>
                  )}
                </Button>
              ))}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="mt-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
              rows={3}
              className="resize-none w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Input type="file" onChange={handleFileChange} className="sr-only" id="file-upload" />
                <label
                  htmlFor="file-upload"
                  className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Paperclip className="h-5 w-5 mr-2" />
                  {attachmentName || "Attach a file"}
                </label>
              </div>
              <Button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                disabled={!selectedUser}
              >
                Send
              </Button>
            </div>
            {attachmentName && (
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span className="text-sm text-gray-600 truncate">{attachmentName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeAttachment}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AdminMessageSystem

