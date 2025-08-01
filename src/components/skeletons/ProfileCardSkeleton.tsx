import { Card } from '@/components/ui/card';

export function ProfileCardSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="p-6 animate-pulse">
        {/* Header with avatar and basic info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
          </div>
        </div>

        {/* Bio section */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/6"></div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>

        {/* Contribution graph placeholder */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md mb-3 w-1/3"></div>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 84 }).map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1"></div>
        </div>
      </div>
    </Card>
  );
}
