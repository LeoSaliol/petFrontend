/* eslint-disable @typescript-eslint/no-explicit-any */
type Notification = any;

export const groupNotifications = (notifications: Notification[]) => {
  const map = new Map();

  for (const notif of notifications) {
    const key = `${notif.type}-${notif.postId}-${notif.actorId}`;

    if (!map.has(key)) {
      map.set(key, {
        ...notif,
        count: 1,
        actors: [notif.actor],
      });
    } else {
      const existing = map.get(key);
      existing.count += 1;
      const alreadyExists = existing.actors.some(
        (a: any) => a.id === notif.actor.id,
      );

      if (!alreadyExists) {
        existing.actors.push(notif.actor);
      } else {
        existing.actors = existing.actors.map((a: any) =>
          a.id === notif.actor.id ? notif.actor : a,
        );
      }
      if (new Date(notif.createdAt) > new Date(existing.createdAt)) {
        existing.createdAt = notif.createdAt;
      }
    }
  }

  return Array.from(map.values());
};

export const formatNotification = (notif: any) => {
  const actorName = notif.actor?.name || "Alguien";

  if (notif.count > 1) {
    if (notif.type === "LIKE") {
      return {
        main: actorName,
        secondary: `y ${notif.count - 1} más dieron like a tu publicación`,
        others: notif.actors.slice(1),
      };
    }
    if (notif.type === "FOLLOW") {
      return {
        main: actorName,
        secondary: `y ${notif.count - 1} más empezaron a seguirte`,
        others: notif.actors.slice(1),
      };
    }
    if (notif.type === "COMMENT") {
      return {
        main: actorName,
        secondary: `y ${notif.count - 1} más comentaron tu publicación`,
        others: notif.actors.slice(1),
      };
    }
    return {
      main: actorName,
      secondary: notif.message.replace(actorName, ""),
      others: notif.actors.slice(1),
    };
  }

  return {
    main: actorName,
    secondary: notif.message.replace(actorName, ""),
    others: [],
  };
};
