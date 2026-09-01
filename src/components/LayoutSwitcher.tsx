interface SwitcherOption<T extends string> {
  value: T;
  label: string;
}

interface LayoutSwitcherProps<T extends string> {
  mode: T;
  options: SwitcherOption<T>[];
  onSwitch: (mode: T) => void;
  disabled: boolean;
}

export function LayoutSwitcher<T extends string>({
  mode,
  options,
  onSwitch,
  disabled,
}: LayoutSwitcherProps<T>) {
  return (
    <div
      className={`flex items-center rounded-full border border-stone-300 bg-white/80 p-1 shadow-sm transition-opacity ${
        disabled ? 'pointer-events-none opacity-40' : 'opacity-100'
      }`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSwitch(opt.value)}
          aria-pressed={mode === opt.value}
          className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
            mode === opt.value
              ? 'bg-stone-700 text-stone-50 shadow-sm'
              : 'text-stone-600 hover:text-stone-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
