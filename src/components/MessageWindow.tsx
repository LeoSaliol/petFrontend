import { useEffect, useRef, useState } from "react";
import type { Conversation, Message } from "../types";
import { MessageBubble } from "./MessageBubble";
import { timeAgoShort } from "../utils/time";
import { Avatar } from "./ChatAvatar";
import { Link } from "react-router-dom";

export const MessageWindow = ({
  conversation,
  messages,
  currentUserId,
  isOnline,
  onSend,
  onLoadMore,
  pet,
}: {
  conversation: Conversation;
  messages: Message[];
  currentUserId: number;
  isOnline: boolean;
  onSend: (content: string) => void;
  onLoadMore: () => void;
  pet?: {
    id: number;
    name: string;
    image: string;
  };
}) => {
  const [input, setInput] = useState("");
  const [petPerfil] = useState<typeof pet | null>(pet ?? null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const other = conversation.participants.find(
    (p) => p.user.id !== currentUserId,
  )?.user;
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [conversation.id]);

  useEffect(() => {
    if (prevMessagesLength.current > messages.length && topRef.current) {
      topRef.current.scrollIntoView({ behavior: "auto" });
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!other) return null;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-neutral-100 bg-white px-5 py-3.5 dark:border-neutral-800 dark:bg-neutral-900">
        <Link to={`/profile/${petPerfil ? petPerfil.id : other.pets[0]?.id}`}>
          <Avatar
            user={{
              id: petPerfil ? petPerfil.id : other.pets[0]?.id,
              name: petPerfil ? petPerfil.name : other.name,
              avatar: petPerfil ? petPerfil.image : other.pets[0]?.image,
              pets: other.pets || null,
              lastSeen: null,
            }}
            isOnline={isOnline}
            size="md"
          />
        </Link>
        <div>
          <Link
            to={`/profile/${petPerfil ? petPerfil.id : other.pets[0]?.id}`}
            className="text-md font-semibold capitalize text-neutral-800 dark:text-neutral-100"
          >
            {other.name}{" "}
            <span className="ml-1 text-[13px] text-neutral-400 dark:text-neutral-400">
              {petPerfil ? petPerfil.name : other.pets[0]?.name}
            </span>
          </Link>
          <div className="text-xs text-neutral-400">
            {isOnline ? (
              <span className="text-emerald-500">En línea</span>
            ) : (
              <p>Ultima conexión: {timeAgoShort(other.lastSeen!)} </p>
            )}
          </div>
        </div>
        <div className="ml-auto">X</div>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-neutral-50 px-5 py-4 dark:bg-neutral-950">
        <div ref={topRef} />
        <button
          onClick={onLoadMore}
          className="self-center py-1 text-xs text-pink-500 transition-colors hover:text-pink-600"
        >
          Cargar mensajes anteriores
        </button>
        <div className="custom-scrollbar min-h-0 overflow-y-auto">
          {messages.map((msg, i) => {
            const isMine = msg.senderId === currentUserId;
            const nextMsg = messages[i + 1];
            const showAvatar =
              !isMine && (!nextMsg || nextMsg.senderId !== msg.senderId);
            return (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                createdAt={msg.createdAt}
                isMine={isMine}
                isRead={msg.isRead}
                showAvatar={showAvatar}
                sender={{
                  id: isMine ? currentUserId : other.id,
                  name: isMine ? "Vos" : other.name,
                  avatar: isMine ? (petPerfil?.image || other.avatar) : other.avatar,
                }}
                pet={isMine ? petPerfil || other.pets[0] : other.pets[0]}
              />
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-neutral-100 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-end gap-2 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí un mensaje..."
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed text-neutral-800 placeholder-neutral-400 outline-none dark:text-neutral-100"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-formColorDark hover:bg-formColorLight flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-neutral-400 dark:text-neutral-600">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
};
