import type { Page, PageFormat } from '@/types';

interface PageContentProps {
  page: Page;
  format?: PageFormat;
}

export function PageContent({ page, format = 'book' }: PageContentProps) {
  return (
    <div className="relative h-full w-full">
      {format === 'landscape' ? (
        <LandscapeContent page={page} />
      ) : (
        <BookContent page={page} />
      )}
      <PageNumberBadge number={page.pageNumber} />
    </div>
  );
}

function PageNumberBadge({ number }: { number: number }) {
  return (
    <span className="pointer-events-none absolute bottom-2 right-3 font-serif text-xs text-stone-400">
      {number}
    </span>
  );
}

function BookContent({ page }: { page: Page }) {
  if (page.type === 'photo') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
        <div className="relative w-full max-w-md flex-1 overflow-hidden rounded-lg shadow-lg">
          <img
            src={page.imageUrl}
            alt={page.caption ?? ''}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        {page.caption && (
          <p className="font-serif text-sm italic text-stone-600">
            {page.caption}
          </p>
        )}
      </div>
    );
  }

  if (page.type === 'mixed') {
    return (
      <div className="flex h-full w-full flex-col gap-4 p-6">
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
          <img
            src={page.imageUrl}
            alt={page.caption ?? ''}
            className="h-44 w-full object-cover sm:h-56"
            loading="lazy"
          />
        </div>
        {page.caption && (
          <p className="text-center font-serif text-sm italic text-stone-600">
            {page.caption}
          </p>
        )}
        <p className="font-serif text-base leading-relaxed text-stone-800">
          {page.content}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <p className="font-serif text-lg leading-relaxed text-stone-800 sm:text-xl">
        {page.content}
      </p>
    </div>
  );
}

function LandscapeContent({ page }: { page: Page }) {
  if (page.type === 'photo') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg">
        <img
          src={page.imageUrl}
          alt={page.caption ?? ''}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {page.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10">
            <p className="font-serif text-sm italic text-white/90">
              {page.caption}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (page.type === 'mixed') {
    return (
      <div className="flex h-full w-full flex-col">
        <div className="relative h-[55%] w-full overflow-hidden">
          <img
            src={page.imageUrl}
            alt={page.caption ?? ''}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {page.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-3 pt-8">
              <p className="font-serif text-sm italic text-white/90">
                {page.caption}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-1 items-center px-5 py-3">
          <p className="font-serif text-base leading-relaxed text-stone-800">
            {page.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center px-6 py-4">
      <p className="font-serif text-base leading-relaxed text-stone-800 sm:text-lg">
        {page.content}
      </p>
    </div>
  );
}
