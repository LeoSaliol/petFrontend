import { useContext, useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Conversation, Message } from "../types";
import { socket } from "../socket/socket";
import { conversationsService } from "../api";
import { AuthContext } from "../context/AuthContext";

export const useChat = () => {
  const { userToken } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [loadingConv, setLoadingConv] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const activeConvIdRef = useRef<number | null>(null);
  const seenMessagesRef = useRef<Set<string>>(new Set());

  const queryFn = useCallback(async () => {
    return conversationsService.getAll();
  }, []);

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn,
    enabled: !!userToken,
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData);
    }
  }, [conversationsData]);

  const updateConversations = useCallback(
    (updater: (prev: Conversation[] | undefined) => Conversation[] | undefined) => {
      setConversations((prev) => updater(prev) ?? []);
    },
    [],
  );

  useEffect(() => {
    activeConvIdRef.current = activeConversation?.id ?? null;
  }, [activeConversation?.id]);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.emit("joinConversations");
    socket.emit("getOnlineUsers");
    socket.on("onlineUsers", ({ userIds }: { userIds: number[] }) => {
      setOnlineUsers(userIds);
    });
    socket.on("userOnline", ({ userId }: { userId: number }) => {
      setOnlineUsers((prev) => [...prev.filter((id) => id !== userId), userId]);
    });
    socket.on("userOffline", ({ userId }: { userId: number }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    socket.on("newConversation", (conversation: Conversation) => {
      updateConversations((prev) => {
        if (!prev || !Array.isArray(prev)) return [conversation];
        const exists = prev.find((c) => c.id === conversation.id);
        if (exists) return prev;
        return [conversation, ...prev];
      });
    });

    socket.on("newMessage", (message: Message) => {
      const isFromMe = message.senderId === userToken;
      const msgKey = `${message.conversationId}-${message.id}`;
      const contentKey = `${message.conversationId}-${message.senderId}-${message.content}`;
      
      if (seenMessagesRef.current.has(msgKey) || seenMessagesRef.current.has(contentKey)) {
        if (isFromMe) {
          seenMessagesRef.current.delete(contentKey);
        }
        return;
      }
      
      if (isFromMe) {
        seenMessagesRef.current.add(msgKey);
      }

      const isActive = activeConvIdRef.current === message.conversationId;

      if (isActive) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        setActiveConversation((prev) => {
          if (!prev || prev.id !== message.conversationId) return prev;
          if (prev.messages.some((m) => m.id === message.id)) return prev;
          return { ...prev, messages: [message, ...prev.messages] };
        });
        socket.emit("markAsRead", { conversationId: message.conversationId });
      }
      updateConversations((prev) => {
        if (!prev || !Array.isArray(prev)) return prev ?? [];
        const updated = prev.map((conv) => {
          if (conv.id !== message.conversationId) return conv;
          return {
            ...conv,
            messages: [message, ...(conv.messages || [])],
            unreadCount: isActive ? 0 : (conv.unreadCount || 0) + 1,
          };
        });
        const targetConv = updated.find((c) => c.id === message.conversationId);
        if (!targetConv) return updated;
        return [targetConv, ...updated.filter((c) => c.id !== message.conversationId)];
      });
    });
    socket.on("messageRead", ({ conversationId }: { conversationId: number }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId === conversationId ? { ...msg, read: true } : msg,
        ),
      );
    });
    socket.on(
      "messageHistory",
      ({ messages: msgs, page }: { messages: Message[]; page: number }) => {
        if (page === 1) {
          setMessages([...msgs].reverse());
        } else {
          setMessages((prev) => [...prev, ...msgs]);
        }
      },
    );
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("onlineUsers");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("newConversation");
      socket.off("newMessage");
      socket.off("messageRead");
      socket.off("messageHistory");
    };
  }, [updateConversations]);

  const openConversation = (targetUserId: number) => {
    setLoadingConv(true);
    socket.once("conversationReady", (conversation: Conversation) => {
      setLoadingConv(false);
      setActiveConversation(conversation);
      setMessages(conversation.messages || []);
      updateConversations((prev) => {
        if (!prev || !Array.isArray(prev)) return [conversation];
        const exists = prev.find((c) => c.id === conversation.id);
        if (exists) return prev;
        return [conversation, ...prev];
      });
    });
    socket.emit("startConversation", { targetUserId });
  };
  const sendMessage = useCallback((conversationId: number, content: string) => {
    if (!content.trim()) return;
    
    socket.emit("sendMessage", { conversationId, content });
  }, []);

  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMessages([]);
    socket.emit("getMessages", { conversationId: conversation.id, page: 1 });
    socket.emit("markAsRead", { conversationId: conversation.id });
    updateConversations((prev) => {
        if (!prev || !Array.isArray(prev)) return prev ?? [];
        return prev.map((conv) =>
          conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv,
        );
      });
  };
  const loadMoreMessages = useCallback((conversationId: number, page: number) => {
    socket.emit("getMessages", { conversationId, page });
  }, []);

  return {
    conversations,
    activeConversation,
    messages,
    onlineUsers,
    loadingConv,
    openConversation,
    sendMessage,
    selectConversation,
    loadMoreMessages,
    isConnected,
    isLoadingConversations: isLoading,
  };
};