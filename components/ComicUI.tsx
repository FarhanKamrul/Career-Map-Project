import React, { ReactNode } from 'react';

// --- Types ---
interface ComicPanelProps {
  children: ReactNode;
  className?: string;
  variant?: 'white' | 'yellow' | 'cyan' | 'magenta';
  title?: string;
}

interface ComicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

interface ComicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface ComicTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

// --- Components ---

export const ComicPanel: React.FC<ComicPanelProps> = ({ children, className = '', variant = 'white', title }) => {
  const bgColors = {
    white: 'bg-comic-paper',
    yellow: 'bg-comic-yellow',
    cyan: 'bg-comic-cyan',
    magenta: 'bg-comic-magenta',
  };

  return (
    <div className={`relative border-4 border-comic-black shadow-comic ${bgColors[variant]} p-6 ${className}`}>
      {title && (
        <div className="absolute -top-6 left-4 bg-comic-magenta border-4 border-comic-black px-4 py-1 transform -rotate-2">
          <h3 className="font-display text-white text-xl tracking-wider uppercase">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export const ComicButton: React.FC<ComicButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-comic-cyan text-comic-black hover:bg-cyan-300',
    secondary: 'bg-comic-yellow text-comic-black hover:bg-yellow-300',
    danger: 'bg-comic-magenta text-white hover:bg-pink-600',
    success: 'bg-green-400 text-comic-black hover:bg-green-300',
  };

  return (
    <button
      className={`
        font-display text-xl uppercase tracking-wide px-8 py-3 
        border-4 border-comic-black shadow-comic 
        transition-all duration-150 transform
        hover:-translate-y-1 hover:shadow-comic-hover active:translate-y-1 active:shadow-comic-sm
        ${variants[variant]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export const ComicInput: React.FC<ComicInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="font-display text-lg text-comic-black uppercase tracking-wide ml-1">{label}</label>
      <input
        className="
          w-full bg-white border-4 border-comic-black p-3 
          font-comic text-lg text-comic-black focus:outline-none focus:ring-4 focus:ring-comic-yellow
        "
        {...props}
      />
    </div>
  );
};

export const ComicTextArea: React.FC<ComicTextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="font-display text-lg text-comic-black uppercase tracking-wide ml-1">{label}</label>
      <textarea
        className="
          w-full bg-white border-4 border-comic-black p-3 
          font-comic text-lg text-comic-black focus:outline-none focus:ring-4 focus:ring-comic-yellow
        "
        {...props}
      />
    </div>
  );
};

export const SpeechBubble: React.FC<{ children: ReactNode; direction?: 'left' | 'right' }> = ({ children, direction = 'left' }) => {
  return (
    <div className={`relative bg-white border-4 border-comic-black p-6 rounded-3xl mx-4 my-6`}>
      <div className="font-comic text-xl leading-relaxed">{children}</div>
      <div 
        className={`absolute bottom-[-20px] w-8 h-8 bg-white border-r-4 border-b-4 border-comic-black transform rotate-45 ${direction === 'left' ? 'left-10' : 'right-10'}`}
      ></div>
      {/* Cover the triangle's top border to blend */}
      <div 
        className={`absolute bottom-[3px] w-8 h-5 bg-white ${direction === 'left' ? 'left-[38px]' : 'right-[38px]'}`}
      ></div>
    </div>
  );
}
