const PATHS = {
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  save: "M6 3h12v18l-6-4-6 4V3Z",
  share: "M12 16V3m-5 5 5-5 5 5M5 13v8h14v-8",
  comment: "M21 11a9 9 0 0 1-9 9H4l-3 2 2-6a9 9 0 1 1 18-5Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  back: "m15 5-7 7 7 7",
  close: "m6 6 12 12M6 18 18 6",
  search: "M21 21l-6-6M17 9a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  home: "m3 10 9-7 9 7v11h-6v-7H9v7H3V10Z",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-3a8 8 0 0 1 16 0v3",
  plus: "M12 5v14M5 12h14",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ? `od-icon ${className}` : "od-icon"}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
