export const ClubPageSkeleton = () => {
  const block = "animate-pulse rounded bg-neutral-200 dark:bg-neutral-700";
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={`h-9 w-40 sm:h-10 ${block}`} />
        <div className={`mt-2 h-4 w-48 ${block}`} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
          >
            <div className={`h-4 w-20 ${block}`} />
            <div className={`h-7 w-16 ${block}`} />
            <div className={`h-4 w-28 ${block}`} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className={`h-10 w-80 max-w-full ${block}`} />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`h-12 w-full ${block}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
