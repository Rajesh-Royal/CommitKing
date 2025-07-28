import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, GitBranch } from "lucide-react";
import { useState } from "react";

interface SearchToggleProps {
  onSearch: (query: string, type: 'profile' | 'repo') => void;
  isLoading?: boolean;
}

export function SearchToggle({ onSearch, isLoading }: SearchToggleProps) {
  const [searchType, setSearchType] = useState<'profile' | 'repo'>('profile');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Search Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex">
          <Button
            variant={searchType === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSearchType('profile')}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all"
          >
            <User className="w-4 h-4 mr-2" />
            Profiles
          </Button>
          <Button
            variant={searchType === 'repo' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSearchType('repo')}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all"
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Repositories
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder={
            searchType === 'profile' 
              ? "Search GitHub profiles..." 
              : "Search GitHub repositories..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg transition-all"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="absolute inset-y-0 right-0 px-4"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>
    </div>
  );
}
