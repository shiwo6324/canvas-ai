import React from 'react';
import { Paintbrush } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-x-2 h-[68px]">
      <Paintbrush className="h-8 w-8 text-indigo-500" />
      <span className="font-bold text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
        Canvas AI
      </span>
    </div>
  );
};

export default Logo;
