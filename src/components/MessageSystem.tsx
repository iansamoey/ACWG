"use client";
/* eslint-disable react/prop-types */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Paperclip, X } from 'lucide-react';

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachment?: {
    filename: string;
    contentType: string;
    url: string;
  };
}

interface MessageSystemProps {
  isAdmin: boolean;
  onUnreadMessagesChange: (count: number) => void;
  selectedUserId?: string;
  selectedUserName?: string;
}

const MessageSystem: React.FC<MessageSystemProps> = ({ isAdmin, onUnreadMessagesChange, selectedUserId, selectedUserName }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const lastMessageTimestampRef = useRef<Date | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const url = isAdmin && selectedUserId
        ? `/api/messages?userId=${selectedUserId}`
        : "/api/messages";
      const response = await fetch(url);
      if (response.ok) {
        const data: Message[] = await response.json();
        return data;
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch messages. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [isAdmin, selectedUserId]);

  const updateMessages = useCallback(async () => {
    const data = await fetchMessages();
    if (data) {
      setMessages((prevMessages) => {
        const newMessages = data.filter(
          (message) => !prevMessages.some((prevMessage) => prevMessage._id === message._id)
        );
        if (newMessages.length > 0) {
          const unreadMessages = newMessages.filter(
            (message) => message.senderId !== session?.user?.id && !message.read
          );
          if (unreadMessages.length > 0) {
            onUnreadMessagesChange(unreadMessages.length);
            const latestMessageTimestamp = new Date(Math.max(...unreadMessages.map((m: Message) => new Date(m.timestamp).getTime())));
            if (!lastMessageTimestampRef.current || latestMessageTimestamp > lastMessageTimestampRef.current) {
              lastMessageTimestampRef.current = latestMessageTimestamp;
            }

            // Mark messages as read
            fetch('/api/messages/mark-read', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messageIds: unreadMessages.map(m => m._id),
              }),
            }).then(response => {
              if (!response.ok) {
                console.error('Failed to mark messages as read');
              }
            }).catch(error => {
              console.error('Error marking messages as read:', error);
            });
          }
        }
        return [...prevMessages, ...newMessages];
      });
    }
  }, [fetchMessages, session, onUnreadMessagesChange]);

  useEffect(() => {
    updateMessages();
    const interval = setInterval(updateMessages, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [updateMessages]);

  useEffect(() => {
    // Reset unread message count when component mounts or unmounts
    onUnreadMessagesChange(0);
    return () => onUnreadMessagesChange(0);
  }, [onUnreadMessagesChange]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    const formData = new FormData();
    formData.append("content", newMessage);
    formData.append("senderId", session?.user?.id || "");
    formData.append("senderName", session?.user?.name || session?.user?.email || "");

    if (isAdmin && selectedUserId) {
      formData.append("receiverId", selectedUserId);
    } else if (!isAdmin) {
      formData.append("receiverId", "admin");
    }

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setNewMessage("");
      setAttachment(null);
      setAttachmentName(null);
      await updateMessages();
      toast({
        title: "Success",
        description: "Message sent successfully.",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
      setAttachmentName(e.target.files[0].name);
    } else {
      setAttachment(null);
      setAttachmentName(null);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentName(null);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const MessageBubble = React.memo(({ message }: { message: Message }) => {
    const isOwnMessage = message.senderId === session?.user?.id;

    return (
      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`max-w-[70%] p-3 rounded-lg ${isOwnMessage ? "bg-blue-100" : "bg-gray-100"}`}>
          <div className="flex justify-between items-start mb-1">
            <span className="font-semibold text-sm">
              {isOwnMessage ? "You" : message.senderName}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {formatDate(message.timestamp)}
            </span>
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
    );
  });

  MessageBubble.displayName = "MessageBubble";

  useEffect(() => {
    const markMessagesAsRead = async () => {
      const unreadMessages = messages.filter(
        (message) => message.senderId !== session?.user?.id && !message.read
      );
      if (unreadMessages.length > 0) {
        try {
          const response = await fetch('/api/messages/mark-read', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messageIds: unreadMessages.map(m => m._id),
            }),
          });
          if (!response.ok) {
            throw new Error('Failed to mark messages as read');
          }
          // Update local state to reflect read messages
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              unreadMessages.some(unread => unread._id === msg._id) 
                ? { ...msg, read: true } 
                : msg
            )
          );
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };

    markMessagesAsRead();
  }, [messages, session]);


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isAdmin ? `Chat with ${selectedUserName}` : "Support Chat"}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={`${message._id}-${message.timestamp}`} message={message} />
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
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="sr-only"
                  id="file-upload"
                />
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
              >
                Send
              </Button>
            </div>
            {attachmentName && (
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span className="text-sm text-gray-600 truncate">
                  {attachmentName}
                </span>
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
  );
};

export default MessageSystem;

