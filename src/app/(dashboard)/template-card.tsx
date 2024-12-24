import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface TemplateCardProps {
  imageSrc: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  description?: string;
  width: number;
  height: number;
  isPremium: boolean | null;
}

const TemplateCard = ({
  imageSrc,
  title,
  onClick,
  disabled,
  description,
  width,
  height,
  isPremium,
}: TemplateCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'space-y-2 group  transition flex flex-col',
        disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
      )}
    >
      <div
        className="relative rounded-xl  h-full w-full overflow-hidden border"
        style={{
          aspectRatio: `${width}/${height}`,
        }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover group-hover:scale-105  transition"
        />
        {isPremium && (
          <div
            className="absolute top-2 right-2 h-10 w-10 flex items-center 
          justify-center text-black/50 rounded-full -z-[10] "
          >
            <Crown className="size-5 fill-yellow-500 text-yellow-500" />
            Premium
          </div>
        )}
        <div
          className="opacity-0 group-hover:opacity-100 transition
        absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl
         backdrop-filter backdrop-blur-sm"
        >
          <p className="text-sm font-medium">在编辑器中打开</p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-left">{title}</p>
        <p
          className="text-xs text-muted-foreground opacity-0 
        group-hover:opacity-75 transition"
        >
          {description}
        </p>
      </div>
    </button>
  );
};

export default TemplateCard;
