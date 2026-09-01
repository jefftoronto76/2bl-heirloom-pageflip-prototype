import { motion, useMotionValue, animate } from 'framer-motion';
import { useRef, useEffect, useState, type ReactNode } from 'react';

interface SlideViewProps {
  currentIndex: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
  onSlideComplete: () => void;
  children: ReactNode[];
}

const SWIPE_THRESHOLD = 0.25;
const VELOCITY_THRESHOLD = 500;

export function SlideView({
  currentIndex,
  totalPages,
  canGoNext,
  canGoPrev,
  onSwipeNext,
  onSwipePrev,
  onSlideComplete,
  children,
}: SlideViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);
  const dragInitiatedRef = useRef(false);
  const hasMountedRef = useRef(false);

  // Measure container width and keep it updated on resize
  useEffect(() => {
    const updateWidth = () => {
      const w = containerRef.current?.offsetWidth ?? 0;
      setContainerWidth(w);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate or snap to target position when page or width changes
  useEffect(() => {
    if (containerWidth === 0) return;

    const targetX = -currentIndex * containerWidth;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      x.set(targetX);
      return;
    }

    const controls = animate(x, targetX, {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1],
      onComplete: () => {
        onSlideComplete();
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, containerWidth]);

  const handleDragStart = () => {
    dragInitiatedRef.current = true;
  };

  const handleDragEnd = (
    _event: PointerEvent | MouseEvent | TouchEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    if (!dragInitiatedRef.current) return;
    dragInitiatedRef.current = false;

    const w = containerWidth || 1;
    const dragRatio = info.offset.x / w;
    const velocity = info.velocity.x;

    const shouldNext = dragRatio < -SWIPE_THRESHOLD || velocity < -VELOCITY_THRESHOLD;
    const shouldPrev = dragRatio > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

    if (shouldNext && canGoNext) {
      onSwipeNext();
      return;
    }

    if (shouldPrev && canGoPrev) {
      onSwipePrev();
      return;
    }

    // Snap back to current page
    animate(x, -currentIndex * w, { duration: 0.3, ease: 'easeOut' });
  };

  const maxDragLeft = -(totalPages - 1) * containerWidth;

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <motion.div
        className="flex h-full"
        style={{ x, width: `${totalPages * 100}%` }}
        drag="x"
        dragConstraints={{ left: maxDragLeft, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="h-full shrink-0 overflow-hidden rounded-lg bg-[#fdfbf7] shadow-lg"
            style={{ width: `${100 / totalPages}%` }}
          >
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
