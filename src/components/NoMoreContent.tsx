import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NoMoreContentProps {
  itemType: 'profile' | 'repo';
  onSearchClick?: () => void;
  onRefreshClick?: () => void;
}

export function NoMoreContent({ itemType, onSearchClick, onRefreshClick }: NoMoreContentProps) {
  const isProfile = itemType === 'profile';
  
  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Search className="h-5 w-5" />
          All {isProfile ? 'Profiles' : 'Repositories'} Rated!
        </CardTitle>
        <CardDescription>
          You&apos;ve seen all the {isProfile ? 'priority profiles' : 'featured repositories'} we have available.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {isProfile 
            ? "Great job exploring the developer community! Ready to discover more profiles?"
            : "You've explored our curated repository list! Want to find more amazing projects?"
          }
        </p>
        
        <div className="flex flex-col gap-2">
          {onSearchClick && (
            <Button onClick={onSearchClick} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search for More {isProfile ? 'Profiles' : 'Repositories'}
            </Button>
          )}
          
          {/* {onRefreshClick && (
            <Button variant="outline" onClick={onRefreshClick} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          )} */}
        </div>
        
        <div className="text-xs text-muted-foreground pt-2 border-t">
          💡 Tip: Use the search feature to discover {isProfile ? 'developers' : 'projects'} by name, technology, or interests!
        </div>
      </CardContent>
    </Card>
  );
}
