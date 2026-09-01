import { useState, useCallback, useRef } from 'react';
import type { LayoutMode, PageFormat } from '@/types';

export function usePageFlip(totalPages: number) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('flip');
  const [pageFormat, setPageFormat] = useState<PageFormat>('book');
  const animLockRef = useRef(false);

  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;

  const goNext = useCallback(() => {
    if (animLockRef.current) return;
    if (currentPage >= totalPages - 1) return;
    animLockRef.current = true;
    setIsAnimating(true);
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  }, [currentPage, totalPages]);

  const goPrev = useCallback(() => {
    if (animLockRef.current) return;
    if (currentPage <= 0) return;
    animLockRef.current = true;
    setIsAnimating(true);
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }, [currentPage]);

  const completeAnimation = useCallback(() => {
    setIsAnimating(false);
    animLockRef.current = false;
  }, []);

  const switchLayout = useCallback(
    (mode: LayoutMode) => {
      if (animLockRef.current) return;
      setLayoutMode(mode);
    },
    [],
  );

  const switchFormat = useCallback(
    (format: PageFormat) => {
      if (animLockRef.current) return;
      setPageFormat(format);
    },
    [],
  );

  return {
    currentPage,
    isAnimating,
    layoutMode,
    pageFormat,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
    completeAnimation,
    switchLayout,
    switchFormat,
  };
}
