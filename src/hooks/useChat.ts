import { useCallback, useEffect, useRef, useState } from "react";
import type { Conversation, Message } from "../types";
import { socket } from "../socket/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getConservations } from "../api/axios";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [loadingConv, setLoadingConv] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const activeConvIdRef = useRef<number | null>(null);
  const queryClient = useQueryClient();
  const { data: conversations = [] }: { data: Conversation[] } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConservations,
    initialData: [],
  });

  const updateConversations = (
    updater: (prev: Conversation[]) => Conversation[],
  ) => {
    queryClient.setQueryData(["conversations"], updater);
  };

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
      updateConversations((prev) => [conversation, ...prev]);
    });

    socket.on("newMessage", (message: Message) => {
      const isActive = activeConvIdRef.current === message.conversationId;
      if (isActive) {
        setMessages((prev) => [...prev, message]);
        socket.emit("markAsRead", { conversationId: message.conversationId });
      }
      updateConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                messages: [message],
                unreadCount: isActive ? 0 : conv.unreadCount + 1,
              }
            : conv,
        ),
      );
    });
    socket.on(
      "messageRead",
      ({ conversationId }: { conversationId: number }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.conversationId === conversationId
              ? { ...msg, read: true }
              : msg,
          ),
        );
      },
    );
    socket.on(
      "messageHistory",
      ({ messages: msgs, page }: { messages: Message[]; page: number }) => {
        if (page === 1) {
          setMessages(msgs.reverse());
        } else {
          setMessages((prev) => [...msgs, ...prev]);
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
  }, []);

  const openConversation = (targetUserId: number) => {
    setLoadingConv(true);
    socket.once("conversationReady", (conversation: Conversation) => {
      setLoadingConv(false);
      setActiveConversation(conversation);
      setMessages(conversation.messages);
      updateConversations((prev) => {
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
    updateConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
      ),
    );
  };
  const loadMoreMessages = useCallback(
    (conversationId: number, page: number) => {
      socket.emit("getMessages", { conversationId, page });
    },
    [],
  );

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
  };
};
