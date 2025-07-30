'use client';

interface TabSelectorProps {
  activeTab: 'profile' | 'repo';
  onTabChange: (tab: 'profile' | 'repo') => void;
}

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex">
        <button
          onClick={() => onTabChange('profile')}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          👤 Profiles
        </button>
        <button
          onClick={() => onTabChange('repo')}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'repo'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📁 Repositories
        </button>
      </div>
    </div>
  );
}
