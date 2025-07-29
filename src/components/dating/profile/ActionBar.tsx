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
    <div className="sticky bottom-0 lg:relative bg-white lg:bg-transparent w-full p-4 lg:p-0 shadow-lg lg:shadow-none rounded-t-lg lg:rounded-none">
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
            className="flex flex-col items-center text-gray-600 hover:text-pink-500 transition-colors group"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-pink-100">
              <Heart className="h-8 w-8" />
            </div>
            <span className="text-sm mt-2 font-semibold">Like</span>
          </button>
        )}

        <button
          onClick={onSuperLike}
          className="flex flex-col items-center text-white transition-colors group"
        >
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg transform group-hover:scale-105 transition-transform">
            <Star className="h-10 w-10" />
          </div>
          <span className="text-sm mt-2 font-semibold text-gray-700">Super Like</span>
        </button>

        <div className="relative group">
          <button className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200">
              <MoreVertical className="h-8 w-8" />
            </div>
            <span className="text-sm mt-2 font-semibold">Plus</span>
          </button>
          <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={onReport}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
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
