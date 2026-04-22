/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead } from "../api/axios";
import { useAuth } from "../context/useAuth";
import {
  formatNotification,
  groupNotifications,
} from "../utils/groupNotifications";
import { Link } from "react-router";

export const Notifications = () => {
  const { pet } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", "preview"],
    queryFn: () => getNotifications(pet!.id),
    enabled: !!pet?.id,
  });

  const handleRead = async (id: string) => {
    await markAsRead(id);

    queryClient.setQueryData(["notifications", "preview"], (old: any) => {
      return old.map((n: any) => (n.id === id ? { ...n, isRead: true } : n));
    });
  };
  const groupedNotifications = groupNotifications(notifications);

  return (
    <>
      <h1 className="mt-8 text-2xl font-bold">Notificaciones</h1>
      <div>
        <ul className="mt-4">
          {groupedNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-2 text-sm transition ${
                !n.isRead ? "hover:bg-[#c911391a] dark:hover:bg-gray-900" : ""
              }`}
              onMouseEnter={() => {
                if (!n.isRead) {
                  setTimeout(() => {
                    handleRead(n.id);
                  }, 500);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Link to={`/profile/${n.actor?.id}`}>
                  <img src={n.actor?.image} className="h-8 w-8 rounded-full" />
                </Link>

                <div className="group relative">
                  <Link
                    to={`/profile/${n.actor?.id}`}
                    className="font-semibold"
                  >
                    {formatNotification(n).main}
                  </Link>{" "}
                  <span className="">{formatNotification(n).secondary}</span>{" "}
                  {formatNotification(n).others.length > 0 && (
                    <div className="absolute top-6 left-0 z-50 hidden w-48 rounded-lg bg-black p-2 text-xs shadow-lg group-hover:block">
                      {formatNotification(n).others.map((actor: any) => (
                        <Link
                          key={actor.id}
                          to={`/profile/${actor.id}`}
                          className="flex items-center gap-2 rounded p-1 hover:bg-gray-800"
                        >
                          <img
                            src={actor.image}
                            className="h-6 w-6 rounded-full"
                          />
                          {actor.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};
