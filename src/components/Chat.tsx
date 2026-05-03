import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import { MessageWindow } from "./MessageWindow";
import { ConversationItem } from "./ConversationItem";
import { useLocation } from "react-router-dom";

export const Chat = () => {
  const { userToken } = useContext(AuthContext);
  const currentUserId = userToken as number;
  const {
    isConnected,
    conversations,
    messages,
    activeConversation,
    onlineUsers,
    loadingConv,
    loadMoreMessages,
    selectConversation,
    sendMessage,
    openConversation,
  } = useChat();
  const location = useLocation();
  const hasOpen = useRef(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(2);
  const pet = location.state?.pet;

  useEffect(() => {
    const targetUserId = location.state?.targetUserId;
    if (targetUserId && !hasOpen.current && isConnected) {
      hasOpen.current = true;
      setTimeout(() => {
        openConversation(targetUserId);
      }, 200);
    }
  }, [isConnected]);

  const filtered = conversations.filter((conv) => {
    const other = conv.participants.find(
      (p) => p.user.id !== currentUserId,
    )?.user;
    return other?.name.toLowerCase().includes(search.toLowerCase());
  });
  const handleLoadMore = () => {
    if (!activeConversation) return;
    loadMoreMessages(activeConversation.id, page);
    setPage((prev) => prev + 1);
  };
  const otherUser = activeConversation?.participants.find(
    (p) => p.user.id !== currentUserId,
  )?.user;

  return (
    <div className="dark:bg-bgBlack bg-bgWhite flex h-[80vh] overflow-hidden rounded-2xl border border-neutral-100 shadow-sm dark:border-neutral-800">
      {/* Sidebar  */}
      <div className="flex shrink-0 flex-col border-r border-neutral-100 md:w-72 dark:border-neutral-800">
        <div className="px-4 pt-4 pb-3">
          <h2 className="mb-3 text-base font-semibold text-neutral-800 dark:text-neutral-100">
            Mensajes
          </h2>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-neutral-700 placeholder-neutral-400 outline-none dark:text-neutral-300"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="mt-8 px-4 text-center text-xs text-neutral-400">
              {search ? "Sin resultados" : "Todavía no tenés conversaciones"}
            </p>
          ) : (
            filtered.map((conv) => {
              const other = conv.participants.find(
                (p) => p.user.id !== currentUserId,
              )?.user;
              return (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  currentUserId={currentUserId}
                  isActive={activeConversation?.id === conv.id}
                  isOnline={other ? onlineUsers.includes(other.id) : false}
                  onClick={() => selectConversation(conv)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Área de los  mensajes */}
      {loadingConv ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="border--400 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      ) : activeConversation ? (
        <MessageWindow
          conversation={activeConversation}
          messages={messages}
          currentUserId={currentUserId}
          pet={pet}
          isOnline={otherUser ? onlineUsers.includes(otherUser.id) : false}
          onSend={(content) => sendMessage(activeConversation.id, content)}
          onLoadMore={handleLoadMore}
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-400 select-none">
          <p className="text-sm font-medium">Seleccioná una conversación</p>
          <p className="text-xs">o iniciá una desde el perfil de un usuario</p>
        </div>
      )}
    </div>
  );
};
