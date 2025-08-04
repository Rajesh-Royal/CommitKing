import { Skeleton } from '../ui/skeleton';

export function ProfileCardSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Profile Card */}
      <div className="border rounded-lg p-6 space-y-6">
        {/* Profile Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <Skeleton className="w-20 h-20 rounded-full" />

            {/* Profile Info */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-5 w-44" />

              {/* Stats */}
              <div className="flex items-center space-x-4 pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          {/* View on GitHub Button */}
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>

        {/* Contributions Section */}
        <div className="border rounded-lg p-6 space-y-4">
          {/* Contributions Title */}
          <Skeleton className="h-6 w-64" />

          {/* Month Labels */}
          <div className="flex justify-between items-center mb-4">
            {['Aug', 'Oct', 'Dec', 'Feb', 'Apr', 'Jun'].map((month, index) => (
              <Skeleton key={index} className="h-4 w-8" />
            ))}
          </div>

          {/* Contribution Grid */}
          <div className="space-y-1">
            {/* Day labels and grid rows */}
            {['Mon', 'Wed', 'Fri'].map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center space-x-1">
                <Skeleton className="h-3 w-8 mr-2" />
                {/* Grid squares for each day */}
                <div className="flex space-x-1">
                  {Array.from({ length: 53 }).map((_, squareIndex) => (
                    <Skeleton
                      key={squareIndex}
                      className="w-3 h-3 rounded-sm"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-8" />
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="w-3 h-3 rounded-sm" />
                ))}
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Outside the card */}
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-12 w-32 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>

      {/* Skip Profile Link - Outside the card */}
      <div className="flex justify-center">
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  );
}
