'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export default function InfoTooltip({ content, className = '' }: InfoTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={200} skipDelayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className={`inline-flex items-center justify-center ml-1.5 text-muted-foreground/60 hover:text-primary focus:text-primary focus:outline-none transition-colors duration-200 ${className}`}
            aria-label="Plus d'informations"
          >
            <FontAwesomeIcon icon={faInfoCircle} className="text-[11px]" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={6}
            collisionPadding={16}
            className="z-[100] max-w-[280px] rounded-xl border border-border/50 bg-popover px-4 py-3 text-[13px] leading-relaxed text-popover-foreground shadow-xl shadow-black/[0.08] backdrop-blur-sm select-none data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=delayed-open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 duration-200"
          >
            {content}
            <Tooltip.Arrow className="fill-popover drop-shadow-sm" width={12} height={6} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
