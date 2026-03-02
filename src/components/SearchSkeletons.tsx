export const SearchSkeletons = ({ hideTop }: { hideTop?: boolean }) => {
  return (
    <div className="flex flex-col gap-3">
      {!hideTop && (
        <div className="h-5 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
      )}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
            <div className="mt-3 flex gap-1.5">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="h-5 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
