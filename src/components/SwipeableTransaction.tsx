import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryIcon } from './CategoryIcons';
import { Edit, Trash2, Copy, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SwipeableTransactionProps {
  transaction: any;
  onEdit?: (transaction: any) => void;
  onDelete?: (id: number) => void;
  onDuplicate?: (transaction: any) => void;
  className?: string;
}

export const SwipeableTransaction: React.FC<SwipeableTransactionProps> = ({
  transaction,
  onEdit,
  onDelete,
  onDuplicate,
  className = ''
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const { toast } = useToast();

  const actionWidth = 80; // Width of each action button

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) return;
      startX.current = e.touches[0].clientX;
      isDragging.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      
      currentX.current = e.touches[0].clientX;
      const deltaX = currentX.current - startX.current;
      
      // Only allow left swipe (negative deltaX)
      if (deltaX < 0) {
        setTranslateX(Math.max(deltaX, -actionWidth * 3));
      } else if (isRevealed) {
        setTranslateX(Math.min(0, deltaX - actionWidth * 3));
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      
      const deltaX = currentX.current - startX.current;
      const threshold = actionWidth;
      
      if (Math.abs(deltaX) > threshold) {
        if (deltaX < 0) {
          // Swiped left - reveal actions
          setTranslateX(-actionWidth * 3);
          setIsRevealed(true);
        } else if (isRevealed) {
          // Swiped right while revealed - hide actions
          setTranslateX(0);
          setIsRevealed(false);
        }
      } else {
        // Didn't swipe far enough - reset
        setTranslateX(isRevealed ? -actionWidth * 3 : 0);
      }
    };

    // Mouse events for desktop
    const handleMouseDown = (e: MouseEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) return;
      startX.current = e.clientX;
      isDragging.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      
      currentX.current = e.clientX;
      const deltaX = currentX.current - startX.current;
      
      if (deltaX < 0) {
        setTranslateX(Math.max(deltaX, -actionWidth * 3));
      } else if (isRevealed) {
        setTranslateX(Math.min(0, deltaX - actionWidth * 3));
      }
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      
      const deltaX = currentX.current - startX.current;
      const threshold = actionWidth;
      
      if (Math.abs(deltaX) > threshold) {
        if (deltaX < 0) {
          setTranslateX(-actionWidth * 3);
          setIsRevealed(true);
        } else if (isRevealed) {
          setTranslateX(0);
          setIsRevealed(false);
        }
      } else {
        setTranslateX(isRevealed ? -actionWidth * 3 : 0);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRevealed]);

  const handleEdit = () => {
    onEdit?.(transaction);
    setTranslateX(0);
    setIsRevealed(false);
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleDelete = () => {
    onDelete?.(transaction.id);
    setTranslateX(0);
    setIsRevealed(false);
    toast({
      title: "Transaction deleted",
      description: `${transaction.description} has been removed.`,
    });
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
  };

  const handleDuplicate = () => {
    onDuplicate?.(transaction);
    setTranslateX(0);
    setIsRevealed(false);
    toast({
      title: "Transaction duplicated",
      description: `Created a copy of ${transaction.description}.`,
    });
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Action buttons background */}
      <div className="absolute right-0 top-0 bottom-0 flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-full rounded-none bg-blue-500 hover:bg-blue-600 text-white"
          style={{ width: actionWidth }}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDuplicate}
          className="h-full rounded-none bg-green-500 hover:bg-green-600 text-white"
          style={{ width: actionWidth }}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-full rounded-none bg-red-500 hover:bg-red-600 text-white"
          style={{ width: actionWidth }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Main transaction card */}
      <Card
        ref={cardRef}
        className="bg-gradient-card border-0 shadow-sm transition-transform duration-200 cursor-grab active:cursor-grabbing micro-bounce"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <CategoryIcon 
              category={transaction.category} 
              variant="gradient"
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">
                  {transaction.description}
                </h3>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'expense' ? 'text-expense' : 'text-success'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground capitalize">
                  {transaction.category}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.date} • {transaction.time}
                </p>
              </div>
            </div>
          </div>
          
          {/* Swipe indicator */}
          <div className="ml-2 opacity-30">
            <MoreHorizontal className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </div>
  );
};