import { usePageFlip } from '@/hooks/usePageFlip';
import { mockPages } from '@/data/mockPages';
import { PageContent } from './PageContent';
import { PageCounter } from './PageCounter';
import { NavControls } from './NavControls';
import { FlipPage } from './FlipPage';
import { SlideView } from './SlideView';
import { LayoutSwitcher } from './LayoutSwitcher';
import type { LayoutMode, PageFormat } from '@/types';

const layoutOptions: { value: LayoutMode; label: string }[] = [
  { value: 'flip', label: 'Flip' },
  { value: 'slide', label: 'Slide' },
];

const formatOptions: { value: PageFormat; label: string }[] = [
  { value: 'book', label: 'Book' },
  { value: 'landscape', label: 'Landscape' },
];

export function BookView() {
  const {
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
  } = usePageFlip(mockPages.length);

  const page = mockPages[currentPage];

  const renderPage = (index: number) => (
    <PageContent page={mockPages[index]} format={pageFormat} />
  );

  const aspectClass = pageFormat === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]';
  const maxWidthClass = pageFormat === 'landscape' ? 'max-w-2xl' : 'max-w-md';

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-stone-200 via-stone-100 to-stone-200 px-4 py-6">
      {/* Toggles */}
      <div className="flex w-full flex-col items-center gap-2">
        <LayoutSwitcher
          mode={layoutMode}
          options={layoutOptions}
          onSwitch={switchLayout}
          disabled={isAnimating}
        />
        <LayoutSwitcher
          mode={pageFormat}
          options={formatOptions}
          onSwitch={switchFormat}
          disabled={isAnimating}
        />
      </div>

      {/* Book area */}
      <div className={`flex w-full ${maxWidthClass} flex-1 items-center justify-center`}>
        <div
          className={`relative ${aspectClass} w-full`}
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {layoutMode === 'slide' ? (
            <SlideView
              currentIndex={currentPage}
              totalPages={mockPages.length}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
              onSwipeNext={goNext}
              onSwipePrev={goPrev}
              onSlideComplete={completeAnimation}
            >
              {mockPages.map((p) => (
                <PageContent key={p.pageNumber} page={p} format={pageFormat} />
              ))}
            </SlideView>
          ) : (
            <FlipPage
              currentPage={currentPage}
              isAnimating={isAnimating}
              onFlipComplete={completeAnimation}
              onDragNext={goNext}
              onDragPrev={goPrev}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
              renderPage={renderPage}
            />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className={`flex w-full ${maxWidthClass} flex-col items-center gap-4 pt-4`}>
        <NavControls
          onPrev={goPrev}
          onNext={goNext}
          canPrev={canGoPrev}
          canNext={canGoNext}
        />
        <PageCounter current={page.pageNumber} total={mockPages.length} />
      </div>
    </div>
  );
}
