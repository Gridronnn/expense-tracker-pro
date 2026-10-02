import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = 'w-5 h-5',
  size = 20,
  color,
}) => {
  // Try to find the exact icon or fallback to CircleDot
  const IconComponent = (Icons as unknown as Record<string, React.FC<Icons.LucideProps>>)[name] || Icons.CircleDot;

  return <IconComponent size={size} className={className} style={color ? { color } : undefined} />;
};
