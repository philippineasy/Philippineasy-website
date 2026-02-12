'use client';

import { Heart, Star, Flag, MessageCircle, MoreVertical } from 'lucide-react';

interface ActionBarProps {
  onLike: () => void;
  onSuperLike: () => void;
  onReport: () => void;
  onMessage: () => void;
  isMatch: boolean;
}

const ActionBar = ({ onLike, onSuperLike, onReport, onMessage, isMatch }: ActionBarProps) => {
  return (
    <div className="sticky bottom-0 lg:relative bg-card lg:bg-transparent w-full p-4 lg:p-0 shadow-lg lg:shadow-none rounded-t-lg lg:rounded-none">
      <div className="flex justify-center items-center space-x-4">
        {isMatch ? (
          <button
            onClick={onMessage}
            className="flex flex-col items-center text-green-500 hover:text-green-600 transition-colors group"
          >
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200">
              <MessageCircle className="h-10 w-10" />
            </div>
            <span className="text-sm mt-2 font-semibold">Message</span>
          </button>
        ) : (
          <button
            onClick={onLike}
            className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors group"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted group-hover:bg-primary/10">
              <Heart className="h-8 w-8" />
            </div>
            <span className="text-sm mt-2 font-semibold">Like</span>
          </button>
        )}

        <button
          onClick={onSuperLike}
          className="flex flex-col items-center text-white transition-colors group"
        >
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary shadow-lg transform group-hover:scale-105 transition-transform">
            <Star className="h-10 w-10" />
          </div>
          <span className="text-sm mt-2 font-semibold text-foreground">Super Like</span>
        </button>

        <div className="relative group">
          <button className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted group-hover:bg-muted/80">
              <MoreVertical className="h-8 w-8" />
            </div>
            <span className="text-sm mt-2 font-semibold">Plus</span>
          </button>
          <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 w-40 bg-card rounded-lg shadow-xl border border-border p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={onReport}
              className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive rounded-md"
            >
              <Flag className="h-4 w-4 mr-2" />
              Signaler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
