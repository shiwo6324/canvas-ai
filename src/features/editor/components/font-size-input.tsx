import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import React from 'react';

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
}

const FontSizeInput = ({ value, onChange }: FontSizeInputProps) => {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(value - 1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(parseInt(e.target.value, 10));

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        className="p-2 rounded-r-none border-r-0"
        size="icon"
        onClick={decrement}
      >
        <Minus className="size-4" />
      </Button>
      <Input
        value={value}
        onChange={handleChange}
        className="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none"
      />
      <Button
        variant="outline"
        className="p-2 rounded-l-none border-l-0"
        size="icon"
        onClick={increment}
      >
        <Plus className="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:right-0 rounded-none" />
      </Button>
    </div>
  );
};

export default FontSizeInput;
