import { cn } from '@/lib/utils';
import { Icon, LucideIcon } from 'lucide-react';
import React from 'react';
import { IconType } from 'react-icons';

interface ShapeToolProps {
  icon: LucideIcon | IconType;
  onClick: () => void;
  iconClassName?: string;
}

const ShapeTool = ({ icon: Icon, onClick, iconClassName }: ShapeToolProps) => {
  return (
    <button onClick={onClick} className="aspect-square border rounded-md p-5">
      <Icon className={cn('h-full w-full', iconClassName)} />
    </button>
  );
};

export default ShapeTool;
