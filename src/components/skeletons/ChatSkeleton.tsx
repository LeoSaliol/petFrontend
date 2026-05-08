export const ChatSkeleton = () => {
    return (
        <div className="dark:bg-bgBlack bg-bgWhite flex h-[80vh] overflow-hidden rounded-2xl border border-neutral-100 shadow-sm dark:border-neutral-800">
            {/* Sidebar skeleton */}
            <div className="shrink-0 flex-col border-r border-neutral-100 md:w-72 dark:border-neutral-800">
                <div className="px-4 pt-4 pb-3">
                    <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="px-4 pb-3">
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </div>
                <div className="flex-1 space-y-3 px-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-2">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message area skeleton */}
            <div className="flex flex-1 flex-col">
                <div className="flex h-14 items-center gap-3 border-b border-neutral-100 px-5 dark:border-neutral-800">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex-1 p-5">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                                <div className={`h-16 ${i % 2 === 0 ? "w-48" : "w-56"} bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse`}></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};