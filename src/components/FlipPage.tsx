import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState, useRef, useEffect, type ReactNode } from 'react';

interface FlipPageProps {
  currentPage: number;
  isAnimating: boolean;
  onFlipComplete: () => void;
  onDragNext: () => void;
  onDragPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  renderPage: (index: number) => ReactNode;
}

const FLIP_THRESHOLD = 0.25;
const VELOCITY_THRESHOLD = 500;

export function FlipPage({
  currentPage,
  isAnimating,
  onFlipComplete,
  onDragNext,
  onDragPrev,
  canGoNext,
  canGoPrev,
  renderPage,
}: FlipPageProps) {
  const rotateY = useMotionValue(0);
  const dragInitiatedRef = useRef(false);
  const snapControlsRef = useRef<{ stop: () => void } | null>(null);
  const displayedPageRef = useRef(currentPage);
  const [isFlipping, setIsFlipping] = useState(false);
  const [fromPage, setFromPage] = useState(currentPage);

  const frontOpacity = useTransform(
    rotateY,
    [-180, -90, -1, 0, 1, 90, 180],
    [0, 0, 1, 1, 1, 0, 0],
  );
  const backOpacity = useTransform(
    rotateY,
    [-180, -91, -90, 0, 90, 91, 180],
    [1, 1, 0, 0, 0, 1, 1],
  );
  const shadowIntensity = useTransform(
    rotateY,
    [-180, -90, 0, 90, 180],
    [0, 0.4, 0, 0.4, 0],
  );
  const boxShadow = useTransform(
    shadowIntensity,
    (v) => `0 ${4 + v * 16}px ${12 + v * 24}px rgba(0,0,0,${0.15 + v * 0.15})`,
  );

  // Detect page change → start flip animation
  useEffect(() => {
    if (currentPage === displayedPageRef.current) return;

    const dir = currentPage > displayedPageRef.current ? 'next' : 'prev';
    setFromPage(displayedPageRef.current);
    setIsFlipping(true);

    const target = dir === 'next' ? -180 : 180;
    const controls = animate(rotateY, target, {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1],
      onComplete: () => {
        displayedPageRef.current = currentPage;
        setIsFlipping(false);
        rotateY.set(0);
        onFlipComplete();
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleDragStart = () => {
    if (isAnimating) return;
    dragInitiatedRef.current = true;
  };

  const handleDrag = (info: { offset: { x: number } }) => {
    if (isAnimating || !dragInitiatedRef.current) return;
    const dragX = info.offset.x;
    const newRotate = dragX * 0.5;

    if (newRotate < 0 && !canGoNext) return;
    if (newRotate > 0 && !canGoPrev) return;

    rotateY.set(newRotate);
  };

  const handleDragEnd = (info: { offset: { x: number }; velocity: { x: number } }) => {
    if (isAnimating || !dragInitiatedRef.current) return;
    dragInitiatedRef.current = false;

    const currentRotation = rotateY.get();
    const velocity = info.velocity.x;
    const thresholdDeg = 180 * FLIP_THRESHOLD;

    const shouldFlipNext = currentRotation < -thresholdDeg || velocity < -VELOCITY_THRESHOLD;
    const shouldFlipPrev = currentRotation > thresholdDeg || velocity > VELOCITY_THRESHOLD;

    if (shouldFlipNext && canGoNext) {
      onDragNext();
      return;
    }

    if (shouldFlipPrev && canGoPrev) {
      onDragPrev();
      return;
    }

    snapControlsRef.current = animate(rotateY, 0, {
      duration: 0.3,
      ease: 'easeOut',
    });
  };

  return (
    <div className="relative h-full w-full" style={{ perspective: '2000px' }}>
      {/* Page behind (the new current page, visible beneath the flipping page) */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        {renderPage(currentPage)}
      </div>

      {/* Flipping page (shows the old page rotating away) */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          rotateY,
          zIndex: 2,
          cursor: isAnimating ? 'default' : 'grab',
        }}
        drag={isAnimating ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={(_, info) => handleDrag(info)}
        onDragEnd={(_, info) => handleDragEnd(info)}
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* Front face — shows the page we're flipping away from */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-lg bg-[#fdfbf7]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            opacity: frontOpacity,
            boxShadow,
          }}
        >
          {isFlipping ? renderPage(fromPage) : renderPage(currentPage)}
        </motion.div>

        {/* Back face — plain surface, no mirrored content */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-lg"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            opacity: backOpacity,
            background: 'linear-gradient(135deg, #f5efe4, #e8ddca)',
          }}
        />
      </motion.div>
    </div>
  );
}
