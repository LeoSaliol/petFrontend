export const NotificationSkeleton = () => {
    return (
        <div className="dark:bg-bgBlack rounded-md px-10 py-6">
            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};