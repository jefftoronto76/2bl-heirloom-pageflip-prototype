interface PageCounterProps {
  current: number;
  total: number;
}

export function PageCounter({ current, total }: PageCounterProps) {
  return (
    <div className="font-serif text-sm tracking-wide text-stone-500">
      Page {current} of {total}
    </div>
  );
}
