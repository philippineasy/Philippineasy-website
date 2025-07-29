'use client';

import React from 'react';

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const RangeSlider = React.forwardRef<HTMLInputElement, RangeSliderProps>(
  ({ className, ...props }, ref) => {
    const sliderStyle = `
      .range-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 8px;
        background: #f1f5f9; /* bg-slate-200 as a fallback for muted */
        border-radius: 9999px;
        outline: none;
      }
      .range-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #3b82f6; /* blue-500 as a fallback for primary */
        border-radius: 9999px;
        cursor: pointer;
        border: 2px solid white;
      }
      .range-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 9999px;
        cursor: pointer;
        border: 2px solid white;
      }
    `;

    return (
      <>
        <style>{sliderStyle}</style>
        <input
          type="range"
          ref={ref}
          className={`range-slider ${className || ''}`}
          {...props}
        />
      </>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';

export { RangeSlider };
