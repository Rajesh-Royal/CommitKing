import { Card } from '@/components/ui/card';

export function RepoCardSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="p-6 animate-pulse">
        {/* Header with repo name and owner */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3"></div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/5"></div>
        </div>

        {/* Language and topics */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md flex-1"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md flex-1"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md flex-1"></div>
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
