import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export function NavControls({ onPrev, onNext, canPrev, canNext }: NavControlsProps) {
  return (
    <div className="flex items-center gap-6">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous page"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white/80 text-stone-700 shadow-sm transition-all hover:scale-105 hover:bg-white hover:shadow-md disabled:pointer-events-none disabled:opacity-30 active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next page"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white/80 text-stone-700 shadow-sm transition-all hover:scale-105 hover:bg-white hover:shadow-md disabled:pointer-events-none disabled:opacity-30 active:scale-95"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
