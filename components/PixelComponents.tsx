import React from 'react';

// Common types
interface BaseProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// A retro card with thick borders and hard shadow
export const PixelCard: React.FC<BaseProps & { title?: string, color?: string }> = ({ 
  children, 
  className = "", 
  title,
  color = "bg-white",
  style
}) => {
  return (
    <div 
      className={`relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${color} ${className}`}
      style={style}
    >
      {title && (
        <div className="border-b-4 border-black p-2 bg-yellow-300 font-bold uppercase tracking-wider flex justify-between items-center">
          <span>{title}</span>
          <div className="flex gap-1">
             <div className="w-3 h-3 bg-black"></div>
             <div className="w-3 h-3 border-2 border-black"></div>
          </div>
        </div>
      )}
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

// A retro button
export const PixelButton: React.FC<BaseProps & { onClick?: () => void, variant?: 'primary' | 'secondary' }> = ({ 
  children, 
  onClick, 
  className = "",
  variant = 'primary'
}) => {
  const bg = variant === 'primary' ? 'bg-yellow-400 hover:bg-yellow-300' : 'bg-gray-200 hover:bg-gray-100';
  
  return (
    <button 
      onClick={onClick}
      className={`
        ${bg} 
        border-4 border-black 
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
        active:translate-y-1 active:shadow-none 
        px-6 py-3 
        font-bold text-lg uppercase tracking-wide 
        transition-all
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// MBTI Badge (small colored rectangles)
export const MBTIBadge: React.FC<{ type: string; color: string }> = ({ type, color }) => (
  <span className={`${color} border-2 border-black text-xs font-bold px-1 py-0.5 inline-block mr-1 mb-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
    {type}
  </span>
);

// Chat Bubble
export const ChatBubble: React.FC<{ 
  text: string; 
  sender: string; 
  isUser?: boolean; 
  className?: string; 
  color?: string;
}> = ({ text, sender, isUser = false, className = "", color }) => {
  const align = isUser ? "items-end" : "items-start";
  const bgColor = color ? color : (isUser ? "bg-green-400" : "bg-white");
  
  return (
    <div className={`flex flex-col ${align} mb-4 ${className}`}>
      {/* Font size increased to text-4xl (approx 3x larger than previous text-xs) */}
      <span className="text-4xl font-black mb-2 uppercase text-gray-800 tracking-tighter" style={{ textShadow: "2px 2px 0px rgba(255,255,255,0.5)" }}>{sender}</span>
      <div className={`
        ${bgColor}
        border-4 border-black
        p-4 max-w-[80%] md:max-w-[60%]
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        font-mono text-lg leading-tight
      `}>
        {text}
      </div>
    </div>
  );
};