import React from 'react';
import { 
  Utensils, 
  Car, 
  Gamepad2, 
  Zap, 
  ShoppingBag, 
  Heart,
  Home,
  GraduationCap,
  Fuel,
  Coffee,
  Gift,
  Dumbbell,
  LucideIcon
} from 'lucide-react';

export interface CategoryConfig {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

export const categoryConfigs: CategoryConfig[] = [
  {
    value: 'food',
    label: 'Food & Dining',
    icon: Utensils,
    color: 'food',
    gradient: 'from-orange-400 to-red-500'
  },
  {
    value: 'transport',
    label: 'Transport',
    icon: Car,
    color: 'transport',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    value: 'entertainment',
    label: 'Entertainment',
    icon: Gamepad2,
    color: 'entertainment',
    gradient: 'from-purple-400 to-purple-600'
  },
  {
    value: 'utilities',
    label: 'Utilities',
    icon: Zap,
    color: 'utilities',
    gradient: 'from-green-400 to-green-600'
  },
  {
    value: 'shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    color: 'shopping',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    value: 'healthcare',
    label: 'Healthcare',
    icon: Heart,
    color: 'healthcare',
    gradient: 'from-red-400 to-red-600'
  },
  {
    value: 'housing',
    label: 'Housing',
    icon: Home,
    color: 'housing',
    gradient: 'from-indigo-400 to-indigo-600'
  },
  {
    value: 'education',
    label: 'Education',
    icon: GraduationCap,
    color: 'education',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    value: 'fuel',
    label: 'Fuel & Gas',
    icon: Fuel,
    color: 'fuel',
    gradient: 'from-gray-400 to-gray-600'
  },
  {
    value: 'coffee',
    label: 'Coffee & Drinks',
    icon: Coffee,
    color: 'coffee',
    gradient: 'from-amber-400 to-brown-500'
  },
  {
    value: 'gifts',
    label: 'Gifts',
    icon: Gift,
    color: 'gifts',
    gradient: 'from-violet-400 to-purple-500'
  },
  {
    value: 'fitness',
    label: 'Fitness',
    icon: Dumbbell,
    color: 'fitness',
    gradient: 'from-emerald-400 to-teal-500'
  }
];

interface CategoryIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'glass';
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 'md', 
  variant = 'default',
  className = '' 
}) => {
  const config = categoryConfigs.find(c => c.value === category);
  if (!config) return null;

  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const containerSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  if (variant === 'gradient') {
    return (
      <div className={`${containerSizes[size]} rounded-xl bg-gradient-to-br ${config.gradient} p-2 shadow-lg ${className}`}>
        <Icon className={`${sizeClasses[size]} text-white`} />
      </div>
    );
  }

  if (variant === 'glass') {
    return (
      <div className={`${containerSizes[size]} rounded-xl glass-effect p-2 ${className}`}>
        <Icon className={`${sizeClasses[size]} text-${config.color}`} />
      </div>
    );
  }

  return (
    <div className={`${containerSizes[size]} rounded-xl bg-${config.color}/10 p-2 ${className}`}>
      <Icon className={`${sizeClasses[size]} text-${config.color}`} />
    </div>
  );
};

export const getCategoryConfig = (category: string) => 
  categoryConfigs.find(c => c.value === category);