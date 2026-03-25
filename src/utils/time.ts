export const timeAgoShort = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);

    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}sem`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mes`;

    const years = Math.floor(months / 12);
    return `${years}a`;
};
