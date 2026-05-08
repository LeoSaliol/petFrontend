export const PostSkeleton = () => {
    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full border border-gray-300 dark:border-gray-700 mb-6 mt-11">
                <div className="flex items-center p-4 gap-1 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mx-3"></div>
                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 ml-auto rounded"></div>
                </div>
            </div>

            <div className="aspect-65/70 w-[50%] bg-gray-200 dark:bg-gray-700 mx-auto rounded-sm h-40 animate-pulse">
                <div className="p-4 mx-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                            <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="w-10 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="w-10 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="w-10 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </>
    );
};
