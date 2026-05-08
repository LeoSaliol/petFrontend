/* eslint-disable @typescript-eslint/no-explicit-any */
type Notification = any;

export const groupNotifications = (notifications: Notification[]) => {
  const map = new Map();

  for (const notif of notifications) {
    const actor = notif.actor || notif.fromUser;
    const postId = notif.relatedPostId || notif.postId;
    const key = `${notif.type}-${postId || 'no-post'}-${actor?.id || notif.fromUser?.id}`;

    if (!map.has(key)) {
      map.set(key, {
        ...notif,
        actor: actor || notif.fromUser,
        count: 1,
        actors: [actor || notif.fromUser],
        postId,
        relatedPostId: postId,
      });
    } else {
      const existing = map.get(key);
      existing.count += 1;
      const existingActor = actor || notif.fromUser;
      const alreadyExists = existing.actors.some(
        (a: any) => a?.id === existingActor?.id,
      );

      if (!alreadyExists && existingActor) {
        existing.actors.push(existingActor);
      }
      const notifDate = new Date(notif.createdAt);
      const existingDate = new Date(existing.createdAt);
      if (notifDate > existingDate) {
        existing.createdAt = notif.createdAt;
      }
    }
  }

  return Array.from(map.values());
};

export const formatNotification = (notif: any) => {
  const actorName = notif.actor?.name || notif.fromUser?.name || "Alguien";
  const type = notif.type?.toUpperCase() || notif.type;

  if (notif.count > 1) {
    if (type === "LIKE") {
      return {
        main: actorName,
        secondary: `y ${notif.count - 1} más dieron like a tu publicación`,
        others: notif.actors.slice(1),
      };
    }
    if (type === "FOLLOW") {
      return {
        main: actorName,
        secondary: `y ${notif.count - 1} más empezaron a seguirte`,
        others: notif.actors.slice(1),
      };
    }
    if (type === "COMMENT") {
      return {
        main: actorName,
        secondary: `y ${notif.count - 1} más comentaron tu publicación`,
        others: notif.actors.slice(1),
      };
    }
    return {
      main: actorName,
      secondary: notif.message?.replace(actorName, "") || "",
      others: notif.actors.slice(1),
    };
  }

  return {
    main: actorName,
    secondary: notif.message?.replace(actorName, "") || "",
    others: [],
  };
};
