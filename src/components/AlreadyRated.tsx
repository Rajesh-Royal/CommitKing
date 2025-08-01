import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AlreadyRatedProps {
  rating: 'hotty' | 'notty';
  itemType: 'profile' | 'repo';
}

export function AlreadyRated({ rating, itemType }: AlreadyRatedProps) {
  const isHotty = rating === 'hotty';
  
  return (
    <Card className={`w-full max-w-md mx-auto mt-6 border-2 ${
      isHotty 
        ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20' 
        : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
    }`}>
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className={`w-12 h-12 ${
            isHotty ? 'text-orange-500' : 'text-blue-500'
          }`} />
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Already Rated!
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          You rated this {itemType} as{' '}
          <span className={`font-bold ${
            isHotty ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'
          }`}>
            {isHotty ? '🔥 Hotty' : '🧊 Notty'}
          </span>
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Thanks for contributing to the community ratings!
        </p>
      </CardContent>
    </Card>
  );
}
