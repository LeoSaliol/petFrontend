export const CommentSkeleton = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <div className="flex h-[90%] w-full max-w-5xl gap-0 rounded-xl bg-[#130f11]">
                {/* Image skeleton */}
                <div className="h-[85%] w-3/5 bg-gray-800 animate-pulse m-4 rounded-lg"></div>
                
                {/* Comment section skeleton */}
                <div className="flex w-2/5 flex-col p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2 mb-4">
                        <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Comments list */}
                    <div className="flex-1 space-y-3 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gray-700 rounded-full animate-pulse"></div>
                                <div className="flex-1 space-y-1">
                                    <div className="h-3 w-20 bg-gray-700 rounded animate-pulse"></div>
                                    <div className="h-3 w-full bg-gray-700 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Input */}
                    <div className="h-12 bg-gray-700 rounded animate-pulse mt-4"></div>
                </div>
            </div>
        </div>
    );
};