import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const TransactionSkeleton: React.FC = () => (
  <Card className="bg-gradient-card border-0 shadow-sm animate-fade-in">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl shimmer" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <Skeleton className="h-4 w-32 shimmer" />
            <Skeleton className="h-4 w-16 shimmer" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20 shimmer" />
            <Skeleton className="h-3 w-24 shimmer" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ChartSkeleton: React.FC = () => (
  <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
    <CardHeader>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32 shimmer" />
        <Skeleton className="h-5 w-20 shimmer" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className={`w-8 shimmer`} style={{ height: `${Math.random() * 100 + 50}px` }} />
              <Skeleton className="w-6 h-3 shimmer" />
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="w-3 h-3 rounded-full shimmer" />
              <Skeleton className="w-16 h-3 shimmer" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const InsightSkeleton: React.FC = () => (
  <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 shimmer" />
        <Skeleton className="h-6 w-32 shimmer" />
        <Skeleton className="h-5 w-16 ml-auto shimmer" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Skeleton className="w-5 h-5 mt-0.5 shimmer" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 shimmer" />
                <Skeleton className="h-5 w-12 shimmer" />
              </div>
              <Skeleton className="h-3 w-full shimmer" />
              <Skeleton className="h-3 w-2/3 shimmer" />
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export const HeatmapSkeleton: React.FC = () => (
  <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
    <CardHeader>
      <Skeleton className="h-6 w-32 shimmer" />
      <Skeleton className="h-4 w-20 shimmer" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex text-xs mb-2">
          <div className="w-8"></div>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 mr-1 shimmer" />
          ))}
        </div>
        <div className="space-y-1">
          {[...Array(13)].map((_, weekIndex) => (
            <div key={weekIndex} className="flex items-center">
              <div className="w-8 mr-2">
                {weekIndex % 4 === 0 && <Skeleton className="w-6 h-3 shimmer" />}
              </div>
              <div className="flex space-x-1">
                {[...Array(7)].map((_, dayIndex) => (
                  <Skeleton key={dayIndex} className="w-3 h-3 rounded-sm shimmer" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-3 w-8 shimmer" />
          <div className="flex space-x-1">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="w-3 h-3 rounded-sm shimmer" />
            ))}
          </div>
          <Skeleton className="h-3 w-8 shimmer" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const BudgetSkeleton: React.FC = () => (
  <Card className="bg-gradient-card border-0 shadow-sm animate-fade-in">
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-lg shimmer" />
            <Skeleton className="h-4 w-20 shimmer" />
          </div>
          <Skeleton className="h-4 w-16 shimmer" />
        </div>
        <Skeleton className="w-full h-2 rounded-full shimmer" />
        <div className="flex justify-between text-xs">
          <Skeleton className="h-3 w-16 shimmer" />
          <Skeleton className="h-3 w-12 shimmer" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const GoalSkeleton: React.FC = () => (
  <Card className="bg-gradient-card border-0 shadow-sm animate-fade-in">
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 shimmer" />
            <Skeleton className="h-3 w-16 shimmer" />
          </div>
          <Skeleton className="h-4 w-20 shimmer" />
        </div>
        <Skeleton className="w-full h-2 rounded-full shimmer" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12 shimmer" />
          <Skeleton className="h-3 w-16 shimmer" />
        </div>
      </div>
    </CardContent>
  </Card>
);