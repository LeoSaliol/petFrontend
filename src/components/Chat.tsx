import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import { MessageWindow } from "./MessageWindow";
import { ConversationItem } from "./ConversationItem";
import { useLocation } from "react-router-dom";
import { CrossIcon } from "../icons/CrossIcon";
import { ChatSkeleton } from "./skeletons";

export const Chat = () => {
  const { userToken, pet } = useContext(AuthContext);
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
    isLoadingConversations,
  } = useChat();
  const location = useLocation();
  const hasOpen = useRef(false);
  const targetUserIdRef = useRef(location.state?.targetUserId);
  const [search, setSearch] = useState("");
  const [msgPage, setMsgPage] = useState(2);
  const [showChat, setShowChat] = useState(false);

  const currentPet =
    pet ??
    (location.state?.pet as
      | { id: number; name: string; image: string }
      | undefined);

  useEffect(() => {
    if (targetUserIdRef.current && !hasOpen.current && isConnected) {
      hasOpen.current = true;
      setTimeout(() => {
        openConversation(targetUserIdRef.current);
      }, 200);
    }
  }, [isConnected, openConversation]);

  const filtered = conversations.filter((conv) => {
    const other = conv.participants.find(
      (p) => p.user.id !== currentUserId,
    )?.user;
    return other?.name.toLowerCase().includes(search.toLowerCase());
  });
  const handleLoadMore = () => {
    if (!activeConversation) return;
    loadMoreMessages(activeConversation.id, msgPage);
    setMsgPage((prev) => prev + 1);
  };
  const handleSelectConversation = (conv: (typeof conversations)[number]) => {
    selectConversation(conv);
    setShowChat(true);
  };
  const otherUser = activeConversation?.participants.find(
    (p) => p.user.id !== currentUserId,
  )?.user;

  return (
    <div className="dark:bg-bgBlack bg-bgWhite flex h-[80vh] overflow-hidden rounded-2xl border border-neutral-100 shadow-sm max-md:relative max-md:flex-col dark:border-neutral-800">
      {/* Sidebar  */}
      <div
        className={`shrink-0 flex-col border-r border-neutral-100 max-md:flex max-md:h-full max-md:w-full max-md:flex-1 md:w-72 dark:border-neutral-800 ${showChat ? "max-md:hidden" : "max-md:flex"}`}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3 max-md:pr-2">
          <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
            Mensajes
          </h2>
          <button
            onClick={() => setShowChat(false)}
            className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 md:hidden dark:hover:bg-neutral-800"
          >
            <CrossIcon className="size-5" stroke="currentColor" />
          </button>
        </div>
        <div className="px-4 pb-3 max-md:px-4">
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
        <div className="flex-1 overflow-x-hidden overflow-y-hidden">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
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
                  pet={currentPet}
                  conversation={conv}
                  currentUserId={currentUserId}
                  isActive={activeConversation?.id === conv.id}
                  isOnline={other ? onlineUsers.includes(other.id) : false}
                  onClick={() => handleSelectConversation(conv)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Área de los  mensajes */}
      {loadingConv ? (
        <ChatSkeleton />
      ) : activeConversation ? (
        <div
          className={`max-md:bg-bgWhite dark:max-md:bg-bgBlack flex flex-1 flex-col max-md:absolute max-md:inset-0 max-md:z-10 max-md:rounded-2xl ${!showChat ? "max-md:hidden" : "max-md:flex"}`}
        >
          <div className="flex h-14 items-center border-b border-neutral-100 px-4 md:hidden dark:border-neutral-800">
            <button
              onClick={() => setShowChat(false)}
              className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <CrossIcon className="size-5" stroke="currentColor" />
            </button>
            <div className="ml-3 flex items-center gap-2">
              {otherUser?.avatar ? (
                <img
                  src={otherUser.avatar}
                  className="size-8 rounded-full object-cover"
                  alt=""
                />
              ) : (
                <div className="bg-pinkNotify flex size-8 items-center justify-center rounded-full text-xs text-white">
                  {otherUser?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                {otherUser?.name}
              </span>
            </div>
          </div>
          <MessageWindow
            conversation={activeConversation}
            messages={messages}
            currentUserId={currentUserId}
            pet={currentPet}
            isOnline={otherUser ? onlineUsers.includes(otherUser.id) : false}
            onSend={(content) => sendMessage(activeConversation.id, content)}
            onLoadMore={handleLoadMore}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-400 select-none max-md:hidden">
          <p className="text-sm font-medium">Seleccioná una conversación</p>
          <p className="text-xs">o iniciá una desde el perfil de un usuario</p>
        </div>
      )}
    </div>
  );
};
