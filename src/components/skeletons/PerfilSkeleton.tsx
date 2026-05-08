export const PerfilSkeleton = () => {
    return (
        <>
            <div className="bg-white dark:bg-gray-900 p-4">
                <header className="flex items-center gap-18 mt-12">
                    <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>

                    <div className="flex flex-col gap-4 flex-1">
                        <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>

                        <div className="flex gap-8">
                            <div className="w-1/4 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="w-1/4 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="w-1/4 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>

                        <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>

                    <button className="w-[15%] py-2 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></button>
                </header>

                <main className="mt-10 grid place-items-center gap-5 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                    <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse"></div>
                    <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse"></div>
                    <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse"></div>
                </main>
            </div>
        </>
    );
};
