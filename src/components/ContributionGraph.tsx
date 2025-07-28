interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
}

interface ContributionGraphProps {
  contributions: ContributionDay[];
  totalContributions: number;
}

const LEVEL_COLORS = {
  0: "bg-gray-100 dark:bg-gray-800",
  1: "bg-green-300 dark:bg-green-900",
  2: "bg-green-400 dark:bg-green-700", 
  3: "bg-green-500 dark:bg-green-500",
  4: "bg-green-600 dark:bg-green-400",
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ContributionGraph({ contributions, totalContributions }: ContributionGraphProps) {
  // Group contributions by week
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];
  
  contributions.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    if (index === 0) {
      // Fill beginning of first week with empty days
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({ date: '', count: 0, level: 0 });
      }
    }
    
    currentWeek.push(day);
    
    if (dayOfWeek === 6 || index === contributions.length - 1) {
      // End of week or last day
      if (index === contributions.length - 1 && dayOfWeek < 6) {
        // Fill end of last week with empty days
        for (let i = dayOfWeek + 1; i <= 6; i++) {
          currentWeek.push({ date: '', count: 0, level: 0 });
        }
      }
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Generate month labels for the top
  const monthLabels: string[] = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    monthLabels.push(MONTHS[date.getMonth()]);
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-white">
      <div className="mb-3">
        <h3 className="text-sm text-gray-200">
          {totalContributions.toLocaleString()} contributions in the last year
        </h3>
      </div>
      
      <div className="flex items-start">
        {/* Month labels on top and day labels on side */}
        <div className="flex flex-col mr-2">
          <div className="h-5 mb-1"></div> {/* Space for month labels */}
          {['Mon', '', 'Wed', '', 'Fri', '', ''].map((day, index) => (
            <div key={index} className="h-2.5 mb-0.5 text-xs text-gray-400 flex items-center w-6">
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex-1">
          {/* Month labels */}
          <div className="flex mb-1 text-xs text-gray-400 h-5 items-end">
            {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
              <div key={index} className="flex-1 text-left" style={{ minWidth: '12px' }}>
                {index % 2 === 0 ? month : ''}
              </div>
            ))}
          </div>
          
          {/* Contribution grid */}
          <div className="grid grid-flow-col auto-cols-max gap-0.5">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-0.5">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-2.5 h-2.5 rounded-sm ${
                      day.date ? LEVEL_COLORS[day.level as keyof typeof LEVEL_COLORS] : 'bg-gray-800'
                    }`}
                    title={day.date ? `${day.count} contributions on ${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
        <div>
          <span>Learn how we count contributions</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Less</span>
          <div className="flex space-x-1 mx-2">
            {Object.entries(LEVEL_COLORS).map(([level, colorClass]) => (
              <div
                key={level}
                className={`w-2.5 h-2.5 rounded-sm ${colorClass}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
